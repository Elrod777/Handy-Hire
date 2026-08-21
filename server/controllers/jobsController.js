const pool = require('../config/database');

const getAllJobs = async (req, res, next) => {
  try {
    const { category, minBudget, maxBudget, latitude, longitude, radius = 50 } = req.query;

    let query = 'SELECT * FROM jobs WHERE status = \'open\'';
    const params = [];

    if (category) {
      query += ` AND category ILIKE $${params.length + 1}`;
      params.push(`%${category}%`);
    }

    if (minBudget) {
      query += ` AND budget_max >= $${params.length + 1}`;
      params.push(minBudget);
    }

    if (maxBudget) {
      query += ` AND budget_min <= $${params.length + 1}`;
      params.push(maxBudget);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const { title, description, category, budget_min, budget_max, location_address, location_latitude, location_longitude, required_skills, preferred_availability, duration_estimate } = req.body;
    const customer_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO jobs (customer_id, title, description, category, budget_min, budget_max, location_address, location_latitude, location_longitude, required_skills, preferred_availability, duration_estimate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [customer_id, title, description, category, budget_min, budget_max, location_address, location_latitude, location_longitude, required_skills, preferred_availability, duration_estimate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer_id = req.user.id;
    const { title, description, category, budget_min, budget_max, status } = req.body;

    const job = await pool.query('SELECT customer_id FROM jobs WHERE id = $1', [id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.rows[0].customer_id !== customer_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE jobs SET title = $1, description = $2, category = $3, budget_min = $4, budget_max = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [title, description, category, budget_min, budget_max, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer_id = req.user.id;

    const job = await pool.query('SELECT customer_id FROM jobs WHERE id = $1', [id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.rows[0].customer_id !== customer_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };