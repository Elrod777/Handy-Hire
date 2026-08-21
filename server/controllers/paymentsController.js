const pool = require('../config/database');
const stripe = require('../config/stripe');

const createPaymentIntent = async (req, res, next) => {
  try {
    const { booking_id, amount } = req.body;
    const user_id = req.user.id;

    // Verify booking exists and user is the customer
    const bookingResult = await pool.query(
      'SELECT b.*, j.customer_id FROM bookings b JOIN jobs j ON b.job_id = j.id WHERE b.id = $1',
      [booking_id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    if (booking.customer_id !== user_id) {
      return res.status(403).json({ error: 'Only the job poster can pay for this booking' });
    }

    // Platform fee = 15% of payment (you get this)
    const platformFee = Math.round(amount * 0.15 * 100); // in cents
    const handypersonAmount = Math.round(amount * 0.85 * 100); // 85% goes to handyperson

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Total amount in cents
      currency: 'usd',
      metadata: { 
        booking_id,
        platform_fee: platformFee,
        handyperson_amount: handypersonAmount
      },
      application_fee_percent: 15 // 15% platform fee
    });

    // Record payment in database
    await pool.query(
      'INSERT INTO payments (booking_id, amount, stripe_payment_intent_id, status) VALUES ($1, $2, $3, $4)',
      [booking_id, amount, paymentIntent.id, 'pending']
    );

    // Record platform earnings
    await pool.query(
      'INSERT INTO platform_earnings (payment_id, booking_id, platform_fee, handyperson_payout, status) VALUES ($1, $2, $3, $4, $5)',
      [paymentIntent.id, booking_id, platformFee / 100, handypersonAmount / 100, 'pending']
    );

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, booking_id } = req.body;
    const user_id = req.user.id;

    // Verify user is the customer
    const bookingResult = await pool.query(
      'SELECT b.*, j.customer_id, j.id as job_id FROM bookings b JOIN jobs j ON b.job_id = j.id WHERE b.id = $1',
      [booking_id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    if (booking.customer_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update payment status
      await pool.query(
        'UPDATE payments SET status = $1 WHERE stripe_payment_intent_id = $2',
        ['succeeded', paymentIntentId]
      );

      // Update platform earnings status
      await pool.query(
        'UPDATE platform_earnings SET status = $1 WHERE payment_id = $2',
        ['succeeded', paymentIntentId]
      );

      // Update booking status
      await pool.query(
        'UPDATE bookings SET status = $1 WHERE id = $2',
        ['completed', booking_id]
      );

      // Create payout record for handyperson
      const handypersonEarnings = await pool.query(
        'SELECT platform_fee, handyperson_payout FROM platform_earnings WHERE payment_id = $1',
        [paymentIntentId]
      );

      if (handypersonEarnings.rows.length > 0) {
        const { handyperson_payout } = handypersonEarnings.rows[0];
        
        await pool.query(
          'INSERT INTO handyperson_payouts (booking_id, handyperson_id, amount, status) VALUES ($1, $2, $3, $4)',
          [booking_id, booking.handyperson_id, handyperson_payout, 'pending']
        );
      }

      res.json({ 
        message: 'Payment successful',
        booking_id,
        yourEarnings: handypersonEarnings.rows[0]?.platform_fee || 0
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    next(error);
  }
};

// Get your platform earnings
const getPlatformEarnings = async (req, res, next) => {
  try {
    // Get total earnings
    const earnings = await pool.query(
      `SELECT 
        SUM(platform_fee) as total_earnings,
        SUM(CASE WHEN status = 'succeeded' THEN platform_fee ELSE 0 END) as completed_earnings,
        SUM(CASE WHEN status = 'pending' THEN platform_fee ELSE 0 END) as pending_earnings,
        COUNT(*) as total_transactions
      FROM platform_earnings`
    );

    // Get recent transactions
    const recentTransactions = await pool.query(
      `SELECT 
        pe.id,
        pe.booking_id,
        pe.platform_fee,
        pe.handyperson_payout,
        pe.status,
        pe.created_at,
        u.first_name,
        u.last_name,
        j.title as job_title
      FROM platform_earnings pe
      JOIN bookings b ON pe.booking_id = b.id
      JOIN jobs j ON b.job_id = j.id
      JOIN users u ON b.customer_id = u.id
      ORDER BY pe.created_at DESC
      LIMIT 50`
    );

    res.json({
      summary: earnings.rows[0],
      recentTransactions: recentTransactions.rows
    });
  } catch (error) {
    next(error);
  }
};

// Withdraw earnings (transfer to your bank account)
const requestPayout = async (req, res, next) => {
  try {
    const { amount, stripe_account_id } = req.body;

    // Verify you have enough earnings
    const earnings = await pool.query(
      `SELECT SUM(platform_fee) as total FROM platform_earnings WHERE status = 'succeeded'`
    );

    const availableEarnings = earnings.rows[0]?.total || 0;
    if (availableEarnings < amount) {
      return res.status(400).json({ error: 'Insufficient earnings' });
    }

    // Create payout with Stripe
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency: 'usd'
    });

    // Record payout in database
    await pool.query(
      `INSERT INTO admin_payouts (amount, stripe_payout_id, status) VALUES ($1, $2, $3)`,
      [amount, payout.id, 'processing']
    );

    res.json({ 
      message: 'Payout requested successfully',
      payoutId: payout.id,
      amount: amount,
      status: payout.status
    });
  } catch (error) {
    next(error);
  }
};

// Webhook to receive Stripe events
const handleStripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Payment succeeded - mark as completed
        await pool.query(
          'UPDATE platform_earnings SET status = $1 WHERE payment_id = $2',
          ['succeeded', event.data.object.id]
        );
        break;

      case 'payout.paid':
        // Payout completed
        await pool.query(
          'UPDATE admin_payouts SET status = $1 WHERE stripe_payout_id = $2',
          ['completed', event.data.object.id]
        );
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: 'Webhook error' });
  }
};

module.exports = { 
  createPaymentIntent, 
  confirmPayment, 
  getPlatformEarnings, 
  requestPayout,
  handleStripeWebhook 
};