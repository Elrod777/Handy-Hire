const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../config/jwt');

const register = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, user_type, phone } = req.body;

    // Check if user exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, user_type, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, user_type',
      [email, hashedPassword, first_name, last_name, user_type, phone]
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, user_type: user.user_type });

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT id, email, password_hash, user_type FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email, user_type: user.user_type });

    res.json({ user: { id: user.id, email: user.email, user_type: user.user_type }, token });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };