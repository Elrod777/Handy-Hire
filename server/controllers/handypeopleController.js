const pool = require('../config/database');

const getAllHandypeople = async (req, res, next) => {
  try {
    const { specialty, minRating } = req.query;

    let query = 'SELECT u.*, hr.average_rating, hr.total_reviews FROM users u LEFT JOIN handyperson_ratings hr ON u.id = hr.handyperson_id WHERE u.user_type = \'handyperson\'';
    const params = [];

    if (specialty) {
      query += ` AND EXISTS (SELECT 1 FROM handypeople_specialties WHERE user_id = u.id AND specialty ILIKE $${params.length + 1})`;
      params.push(`%${specialty}%`);
    }

    if (minRating) {
      query += ` AND hr.average_rating >= $${params.length + 1}`;
      params.push(minRating);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getHandypersonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      'SELECT u.*, hr.average_rating, hr.total_reviews FROM users u LEFT JOIN handyperson_ratings hr ON u.id = hr.handyperson_id WHERE u.id = $1 AND u.user_type = \'handyperson\'',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Handyperson not found' });
    }

    const specialtiesResult = await pool.query('SELECT specialty, experience_years FROM handypeople_specialties WHERE user_id = $1', [id]);

    res.json({ ...userResult.rows[0], specialties: specialtiesResult.rows });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    if (parseInt(id) !== user_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { first_name, last_name, bio, profile_picture_url, specialties } = req.body;

    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, bio = $3, profile_picture_url = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [first_name, last_name, bio, profile_picture_url, id]
    );

    if (specialties && specialties.length > 0) {
      await pool.query('DELETE FROM handypeople_specialties WHERE user_id = $1', [id]);
      for (const specialty of specialties) {
        await pool.query(
          'INSERT INTO handypeople_specialties (user_id, specialty, experience_years) VALUES ($1, $2, $3)',
          [id, specialty.specialty, specialty.experience_years]
        );
      }
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllHandypeople, getHandypersonById, updateProfile };