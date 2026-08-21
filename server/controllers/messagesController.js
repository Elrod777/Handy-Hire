const pool = require('../config/database');

const sendMessage = async (req, res, next) => {
  try {
    const { booking_id, recipient_id, message_text } = req.body;
    const sender_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO messages (booking_id, sender_id, recipient_id, message_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [booking_id, sender_id, recipient_id, message_text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const result = await pool.query(
      'SELECT * FROM messages WHERE booking_id = $1 ORDER BY created_at ASC',
      [bookingId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getUserConversations = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT DISTINCT b.id, b.job_id, u.id as other_user_id, u.first_name, u.last_name, u.profile_picture_url, m.message_text, m.created_at as last_message_time
       FROM bookings b
       JOIN messages m ON b.id = m.booking_id
       JOIN users u ON (u.id = b.customer_id AND b.handyperson_id = $1) OR (u.id = b.handyperson_id AND b.customer_id = $1)
       WHERE b.customer_id = $1 OR b.handyperson_id = $1
       ORDER BY m.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessages, getUserConversations };