const pestService = require('../services/pestService');

exports.analyzePest = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required for AI pathology analysis' });
        }
        
        const crop = req.body.crop || 'Unknown';
        const imageUrl = `/uploads/${req.file.filename}`;
        const userId = req.user ? req.user.id : null;
        const apiKey = req.headers['x-gemini-api-key'] || req.body.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

        const analysis = await pestService.analyzeImage(crop, imageUrl, userId, { apiKey });
        res.json(analysis);
    } catch (err) {
        next(err);
    }
};
