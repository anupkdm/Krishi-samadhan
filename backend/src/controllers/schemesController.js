const schemesService = require('../services/schemesService');

exports.getSchemes = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        const schemes = await schemesService.getSchemes(search, category);
        res.json({ schemes });
    } catch (err) {
        next(err);
    }
};

exports.getSchemeDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const scheme = await schemesService.getSchemeById(id);
        if (!scheme) {
            return res.status(404).json({ error: 'Scheme not found' });
        }
        res.json({ scheme });
    } catch (err) {
        next(err);
    }
};
