const express = require('express');
const router = express.Router();
const inputStoreController = require('../controllers/inputStoreController');

router.get('/', inputStoreController.getInputs);

module.exports = router;
