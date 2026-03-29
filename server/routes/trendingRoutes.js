const express = require('express');
const router = express.Router();
const {
  getTrendingTopics,
  getTrendingTopic,
  createTrendingTopic,
  updateTrendingTopic,
  deleteTrendingTopic,
  addReply,
  toggleLike,
  toggleDislike,
  toggleReplyLike,
  toggleReplyDislike,
  saveTrendingTopic,
  unsaveTrendingTopic,
  saveTrendingReply,
  unsaveTrendingReply,
  checkTrendingReplySaved
} = require('../controllers/trendingController');
const auth = require('../middleware/authMiddleware');

// Get all trending topics and create trending topic
router.route('/')
  .get(getTrendingTopics)
  .post(auth, createTrendingTopic);

// Manage single trending topic
router.route('/:id')
  .get(getTrendingTopic)
  .put(auth, updateTrendingTopic)
  .delete(auth, deleteTrendingTopic);

// Trending topic interactions
router.post('/:id/replies', auth, addReply);
router.post('/:id/replies/:replyId/like', auth, toggleReplyLike);
router.post('/:id/replies/:replyId/dislike', auth, toggleReplyDislike);
router.post('/:id/like', auth, toggleLike);
router.post('/:id/dislike', auth, toggleDislike);

// Save/Unsave trending topic
router.post('/:id/save', auth, saveTrendingTopic);
router.delete('/:id/save', auth, unsaveTrendingTopic);

// Save/Unsave trending reply routes
router.post('/:topicId/replies/:replyId/save', auth, saveTrendingReply);
router.delete('/:topicId/replies/:replyId/save', auth, unsaveTrendingReply);
router.get('/:topicId/replies/:replyId/saved', auth, checkTrendingReplySaved);

module.exports = router;