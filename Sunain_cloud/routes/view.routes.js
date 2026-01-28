const express = require('express');
const auth = require('../middleware/auth.middleware');
const { viewFile } = require('../controllers/view.controller');

const router = express.Router();

router.get('/view/:fileId', auth, viewFile);

module.exports = router;
