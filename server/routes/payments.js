const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const { authenticate } = require('../middleware/auth');

// Stripe webhook (doesn't need authentication)
router.post('/webhook', express.raw({type: 'application/json'}), paymentsController.handleStripeWebhook);

// Your earnings endpoints
router.get('/earnings', paymentsController.getPlatformEarnings);
router.post('/payout', paymentsController.requestPayout);

// Customer payment endpoints
router.post('/create-intent', authenticate, paymentsController.createPaymentIntent);
router.post('/confirm', authenticate, paymentsController.confirmPayment);

module.exports = router;