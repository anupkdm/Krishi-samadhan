const express = require('express');
const router = express.Router();
const gisController = require('../controllers/gisController');

router.get('/', gisController.getGisData);
router.get('/data', gisController.getGisData);
router.post('/simulate', gisController.simulateWorkflow);
router.post('/send-alert', gisController.sendAlert);

module.exports = router;
