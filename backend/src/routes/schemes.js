const express = require('express');
const router = express.Router();
const schemesController = require('../controllers/schemesController');

router.get('/', schemesController.getSchemes);
router.get('/:id', schemesController.getSchemeDetails);

module.exports = router;
