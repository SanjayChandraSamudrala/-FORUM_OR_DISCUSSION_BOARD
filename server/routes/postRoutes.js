const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addReply,
  toggleLike,
  toggleDislike,
  toggleReplyLike,
  toggleReplyDislike,
  savePost,
  unsavePost,
  checkSavedPost,
  saveReply,
  unsaveReply,
  checkReplySaved,
  getDistinctCategories,
  getAllPosts,
  getTrendingCategories
} = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Get all posts and create post
router.route('/')
  .get(getPosts)
  .post(auth, createPost);

// Get trending categories
router.get('/trending-categories', getTrendingCategories);

// Admin - Get all posts
router.get('/all', auth, admin, getAllPosts);

// New route to get distinct categories
router.get('/categories/distinct', getDistinctCategories);

// Get, update and delete specific post
router.route('/:id')
  .get(getPost)
  .put(auth, updatePost)
  .delete(auth, deletePost);

// Post interactions
router.post('/:id/replies', auth, addReply);
router.post('/:id/like', auth, toggleLike);
router.post('/:id/dislike', auth, toggleDislike);

// Reply interactions
router.post('/:postId/replies/:replyId/like', auth, toggleReplyLike);
router.post('/:postId/replies/:replyId/dislike', auth, toggleReplyDislike);

// Save/Unsave reply routes
router.post('/:postId/replies/:replyId/save', auth, saveReply);
router.delete('/:postId/replies/:replyId/save', auth, unsaveReply);
router.get('/:postId/replies/:replyId/saved', auth, checkReplySaved);

// Save/Unsave post
router.post('/:id/save', auth, savePost);
router.delete('/:id/save', auth, unsavePost);
// Check if post is saved
router.get('/:id/saved', auth, checkSavedPost);

module.exports = router; 