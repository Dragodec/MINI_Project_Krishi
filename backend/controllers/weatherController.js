const { getWeatherData } = require('../services/weatherService');

exports.getWeather = async (req, res) => {
  try {
    const data = await getWeatherData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
};