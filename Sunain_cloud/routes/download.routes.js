const express = require('express')
const auth = require('../middleware/auth.middleware')
const { downloadFile } = require('../controllers/download.controller')

const router = express.Router();

router.get("/download/:fileId",auth,downloadFile)

module.exports = router;