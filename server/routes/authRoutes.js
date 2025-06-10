const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  getUserThreads,
  requestPasswordReset
} = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.get('/threads', auth, getUserThreads);

module.exports = router; 