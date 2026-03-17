const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

exports.getWeatherData = async () => {
  const cached = cache.get('weather');
  if (cached) return cached;

  const { WEATHER_API_KEY, WEATHER_LAT, WEATHER_LON } = process.env;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&appid=${WEATHER_API_KEY}&units=metric`;

  const res = await axios.get(url);
  const processed = processWeather(res.data);

  cache.set('weather', processed);
  return processed;
};

function processWeather(data) {
  const hourly = data.list.slice(0, 8).map(item => ({
    // FIX: Using item.dt (timestamp) instead of dt_txt string for local time conversion
    time: new Date(item.dt * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    temp: Math.round(item.main.temp),
    rain: Math.round(item.pop * 100),
    wind: item.wind.speed,
    humidity: item.main.humidity
  }));

  const current = hourly[0];
  const recommendations = [];

  // --- DYNAMIC SPRAY SCORE CALCULATION ---
  // We start at 100 and deduct based on unfavorable conditions
  let score = 100;
  
  if (current.rain > 20) score -= 30; // Rain washes away chemicals
  if (current.rain > 50) score -= 40; 
  if (current.wind > 5) score -= 20;  // Wind causes "Spray Drift"
  if (current.wind > 10) score -= 30;
  if (current.temp > 32) score -= 10; // High heat causes rapid evaporation
  
  const sprayScore = Math.max(0, score); // Ensure score doesn't go below 0

  // --- SMART RECOMMENDATIONS ---
  if (current.rain > 60) recommendations.push("High Rain Risk: Postpone pesticide application");
  if (current.wind > 8) recommendations.push("Windy Conditions: Risk of spray drift to other crops");
  if (current.humidity > 80) recommendations.push("High Fungal Risk: Monitor for leaf spots");
  if (current.temp > 33) recommendations.push("Heat Alert: Increase irrigation to prevent wilting");
  if (sprayScore > 85) recommendations.push("Optimal conditions for farm maintenance");

  return {
    location: data.city.name,
    current,
    hourly,
    recommendations,
    sprayScore // Now returning the calculated score to the frontend
  };
}