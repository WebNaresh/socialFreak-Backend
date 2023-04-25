const express = require('express');
const { sendMessage, getMessage } = require('../controller/msgController');
const router = express.Router();
router.route('/sendMessage').post(sendMessage);
router.route('/getMessage').post(getMessage);
module.exports = router;