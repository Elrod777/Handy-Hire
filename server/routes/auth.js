const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, registerSchema } = require('../middleware/validation');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;