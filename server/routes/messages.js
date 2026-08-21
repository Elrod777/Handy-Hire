const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, messagesController.sendMessage);
router.get('/:bookingId', authenticate, messagesController.getMessages);
router.get('/', authenticate, messagesController.getUserConversations);

module.exports = router;