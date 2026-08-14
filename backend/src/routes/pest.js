const express = require('express');
const router = express.Router();
const pestController = require('../controllers/pestController');
const upload = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');

router.post('/analyze', optionalAuth, upload.single('image'), pestController.analyzePest);

module.exports = router;
