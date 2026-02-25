const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

exports.getWeatherData = async () => {
  const cached = cache.get('weather');
  if (cached) return cached;

  const { WEATHER_API_KEY, WEATHER_LAT, WEATHER_LON } = process.env;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&appid=${WEATHER_API_KEY}&units=metric`;

  const res = await axios.get(url);

  const data = res.data;

  const processed = processWeather(data);

  cache.set('weather', processed);

  return processed;
};

function processWeather(data) {
  const hourly = data.list.slice(0, 8).map(item => ({
    time: item.dt_txt,
    temp: item.main.temp,
    rain: item.pop * 100,
    wind: item.wind.speed,
    humidity: item.main.humidity
  }));

  const current = hourly[0];

  const recommendations = [];

  if (current.rain > 60) recommendations.push("Avoid pesticide spraying");
  if (current.wind > 10) recommendations.push("High wind: avoid spraying");
  if (current.humidity > 80) recommendations.push("High fungal disease risk");
  if (current.temp > 32) recommendations.push("Irrigation recommended");

  return {
    location: data.city.name,
    current,
    hourly,
    recommendations
  };
}