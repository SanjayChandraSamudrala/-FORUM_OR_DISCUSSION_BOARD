const express = require('express');
const router = express.Router();
const { getUserContent, getLikedContent, getSavedItems, getAllUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Admin - Get all users
router.get('/all', auth, admin, getAllUsers);

// Admin - Delete a user
router.delete('/:id', auth, admin, deleteUser);

// Get user's content (threads and responses)
router.get('/:userId/content', auth, getUserContent);

// Get user's liked content
router.get('/:userId/liked-content', auth, getLikedContent);

// Add this route for fetching saved items
router.get('/saved', auth, getSavedItems);

// Admin - Update a user's role
router.patch('/:id/role', auth, admin, updateUserRole);

module.exports = router; 