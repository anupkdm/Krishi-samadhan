const pestService = require('../services/pestService');

exports.analyzePest = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        
        const crop = req.body.crop || 'Unknown';
        const imageUrl = `/uploads/${req.file.filename}`;
        const userId = req.user ? req.user.id : null;

        const analysis = await pestService.analyzeImage(crop, imageUrl, userId);
        res.json(analysis);
    } catch (err) {
        next(err);
    }
};
