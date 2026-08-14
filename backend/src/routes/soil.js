const express = require('express');
const router = express.Router();
const soilController = require('../controllers/soilController');

router.get('/', soilController.getSoilData);
router.get('/data', soilController.getSoilData);

module.exports = router;
