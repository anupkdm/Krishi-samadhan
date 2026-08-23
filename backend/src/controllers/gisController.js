const gisService = require('../services/gisService');

exports.getGisData = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat) || 19.5772;
        const lon = parseFloat(req.query.lon) || 74.2173;

        const data = await gisService.getGisSpatialData(lat, lon);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.simulateWorkflow = async (req, res, next) => {
    try {
        const { scenario, plotId } = req.body;
        const result = await gisService.simulatePipeline(scenario || 'HEAVY_RAIN', plotId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.sendAlert = async (req, res, next) => {
    try {
        const { farmerName, phone, crop, alertType, language, customMessage } = req.body;
        const result = await gisService.sendFarmerAlert({
            farmerName: farmerName || 'Ramesh Patil',
            phone,
            crop: crop || 'Onion',
            alertType: alertType || 'HEAVY_RAIN',
            language: language || 'en',
            customMessage
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
};
