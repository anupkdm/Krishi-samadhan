const chatbotService = require('../services/chatbotService');

async function handleMessage(req, res, next) {
    try {
        const { message, location } = req.body;
        const response = await chatbotService.processMessage(message, location);
        res.json({
            status: 'success',
            reply: response.reply,
            suggestions: response.suggestions,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleMessage
};
