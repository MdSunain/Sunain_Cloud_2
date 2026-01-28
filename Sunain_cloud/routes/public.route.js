const express = require('express');
const { viewSharedFile } = require('../controllers/publicview.controller');

const router = express.Router();

router.get('/share/:token', viewSharedFile);

module.exports = router;
