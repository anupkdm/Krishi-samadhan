const inputStoreService = require('../services/inputStoreService');

function getInputs(req, res, next) {
    try {
        const { category, locality, search } = req.query;
        const data = inputStoreService.getInputStores(category, locality, search);
        res.json({
            status: 'success',
            count: data.length,
            records: data
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getInputs
};
