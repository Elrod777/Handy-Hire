const pool = require('../config/database');

const createBooking = async (req, res, next) => {
  try {
    const { job_id, application_id, agreed_price, scheduled_date, scheduled_time } = req.body;
    const customer_id = req.user.id;

    // Get job and handyperson details
    const jobResult = await pool.query('SELECT customer_id FROM jobs WHERE id = $1', [job_id]);
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const appResult = await pool.query('SELECT handyperson_id FROM job_applications WHERE id = $1', [application_id]);
    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const handyperson_id = appResult.rows[0].handyperson_id;

    const result = await pool.query(
      'INSERT INTO bookings (job_id, customer_id, handyperson_id, application_id, agreed_price, scheduled_date, scheduled_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [job_id, customer_id, handyperson_id, application_id, agreed_price, scheduled_date, scheduled_time]
    );

    // Update job status
    await pool.query('UPDATE jobs SET status = \'assigned\' WHERE id = $1', [job_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      'SELECT * FROM bookings WHERE customer_id = $1 OR handyperson_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getUserBookings, getBookingById, updateBookingStatus };