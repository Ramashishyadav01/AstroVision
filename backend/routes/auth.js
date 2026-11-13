const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/profile
router.get('/profile', auth, getProfile);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// @route   GET /api/auth/reset-password/:token/verify
router.get('/reset-password/:token/verify', verifyResetToken);

// @route   POST /api/auth/reset-password/:token
router.post('/reset-password/:token', resetPassword);

module.exports = router;
