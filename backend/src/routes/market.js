const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/prices', marketController.getPrices);
router.get('/compare', marketController.comparePrices);
router.get('/trends', marketController.getTrends);

module.exports = router;
