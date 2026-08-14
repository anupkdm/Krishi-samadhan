const marketService = require('../services/marketService');

exports.getPrices = async (req, res, next) => {
    try {
        const { commodity, state, district, market } = req.query;
        const data = await marketService.getMarketPrices(commodity, state, district, market);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.comparePrices = async (req, res, next) => {
    try {
        const { commodity, state, district } = req.query;
        const data = await marketService.compareMarkets(commodity, state, district);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.getTrends = async (req, res, next) => {
    try {
        const { commodity, market } = req.query;
        const data = await marketService.getMarketTrends(commodity, market);
        res.json(data);
    } catch (err) {
        next(err);
    }
};
