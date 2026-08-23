const weatherService = require('../services/weatherService');

exports.getCurrentWeather = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat) || 19.8833;
        const lon = parseFloat(req.query.lon) || 74.4833;

        const data = await weatherService.getCurrentWeather(lat, lon);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getForecast = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat) || 19.8833;
        const lon = parseFloat(req.query.lon) || 74.4833;

        const data = await weatherService.getForecast(lat, lon);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.sendAlert = async (req, res, next) => {
    try {
        const { farmerName, phone, alertType, language } = req.body;
        const data = await weatherService.sendWeatherSms({ farmerName, phone, alertType, language });
        res.json(data);
    } catch (err) {
        next(err);
    }
};
