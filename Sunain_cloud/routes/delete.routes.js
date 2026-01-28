const express = require('express');
const auth = require('../middleware/auth.middleware');
const { deleteFile } = require('../controllers/delete.controller');

const router = express.Router();

router.post('/delete/:fileId', auth, deleteFile);

module.exports = router;
