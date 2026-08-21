const stripe = require('../config/stripe');
const pool = require('../config/database');

const createPaymentIntent = async (req, res, next) => {
  try {
    const { booking_id, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'usd',
      metadata: { booking_id }
    });

    await pool.query(
      'INSERT INTO payments (booking_id, amount, stripe_payment_intent_id, status) VALUES ($1, $2, $3, $4)',
      [booking_id, amount, paymentIntent.id, 'pending']
    );

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, booking_id } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      await pool.query(
        'UPDATE payments SET status = \'succeeded\' WHERE stripe_payment_intent_id = $1',
        [paymentIntentId]
      );

      res.json({ message: 'Payment successful', booking_id });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createPaymentIntent, confirmPayment };