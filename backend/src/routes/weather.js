const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/current', weatherController.getCurrentWeather);
router.get('/forecast', weatherController.getForecast);
router.get('/', weatherController.getCurrentWeather);
router.post('/send-alert', weatherController.sendAlert);

module.exports = router;
