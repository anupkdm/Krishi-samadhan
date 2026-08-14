const weatherService = require('../services/weatherService');

exports.getCurrentWeather = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lon) are required' });
        }

        const data = await weatherService.getCurrentWeather(lat, lon);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getForecast = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lon) are required' });
        }

        const data = await weatherService.getForecast(lat, lon);
        res.json(data);
    } catch (err) {
        next(err);
    }
};
