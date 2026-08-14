const express = require('express');
const router = express.Router();
const satelliteController = require('../controllers/satelliteController');

router.get('/', satelliteController.getSatelliteData);
router.get('/data', satelliteController.getSatelliteData);

module.exports = router;
