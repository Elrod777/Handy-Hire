const pool = require('../config/database');

const createReview = async (req, res, next) => {
  try {
    const { booking_id, reviewee_id, rating, review_text } = req.body;
    const reviewer_id = req.user.id;

    // Check if booking exists and is completed
    const bookingResult = await pool.query('SELECT status FROM bookings WHERE id = $1', [booking_id]);
    if (bookingResult.rows.length === 0 || bookingResult.rows[0].status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, review_text) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [booking_id, reviewer_id, reviewee_id, rating, review_text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getHandypersonReviews = async (req, res, next) => {
  try {
    const { handypersonId } = req.params;

    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.profile_picture_url 
       FROM reviews r 
       JOIN users u ON r.reviewer_id = u.id 
       WHERE r.reviewee_id = $1 
       ORDER BY r.created_at DESC`,
      [handypersonId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getHandypersonReviews };