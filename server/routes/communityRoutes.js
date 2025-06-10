const express = require('express');
const router = express.Router();
const {
  createCommunity,
  getCommunities,
  getCommunityById,
  addCommunityMember,
  removeCommunityMember
} = require('../controllers/communityController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public route to get all communities
router.get('/', getCommunities);

// Protected routes (require authentication)
router.use(auth);

// Create a new community
router.post('/', createCommunity);

// Get specific community details
router.get('/:id', getCommunityById);

// Add/remove community members (require authentication, and admin/creator for private communities)
router.patch('/:id/add-member', addCommunityMember);
router.patch('/:id/remove-member', removeCommunityMember);

module.exports = router; 