const express = require('express');
const router = express.Router();
const advisoryController = require('../controllers/advisoryController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, advisoryController.getAdvisory);
router.post('/generate', optionalAuth, advisoryController.generateAdvisory);

module.exports = router;
