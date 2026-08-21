const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const { authenticate } = require('../middleware/auth');

router.post('/create-intent', authenticate, paymentsController.createPaymentIntent);
router.post('/confirm', authenticate, paymentsController.confirmPayment);

module.exports = router;