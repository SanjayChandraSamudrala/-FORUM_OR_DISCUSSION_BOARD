const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  markMessageAsRead,
  markMessageAsReplied,
  deleteContactMessage
} = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public route for submitting a contact message
router.post('/', submitContactMessage);

// Admin routes for managing contact messages (require authentication and admin role)
router.get('/all', auth, admin, getContactMessages);
router.patch('/:id/read', auth, admin, markMessageAsRead);
router.patch('/:id/replied', auth, admin, markMessageAsReplied);
router.delete('/:id', auth, admin, deleteContactMessage);

module.exports = router; 