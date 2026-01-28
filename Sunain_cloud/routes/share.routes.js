const express = require('express');
const auth = require('../middleware/auth.middleware');
const { shareFile } = require('../controllers/share.controller');

const router = express.Router();

router.post('/share/:fileId', auth, shareFile);

module.exports = router;
