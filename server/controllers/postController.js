const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts with optional filtering
exports.getPosts = async (req, res) => {
  try {
    const { 
      category,
      sort = 'latest',
      page = 1,
      limit = 10,
      status = 'active'
    } = req.query;

    const query = { status };
    if (category) query.category = category;

    let sortOption = {};
    switch (sort) {
      case 'latest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'popular':
        sortOption = { views: -1 };
        break;
      case 'mostLiked':
        sortOption = { 'likes.length': -1 };
        break;
      case 'mostReplies':
        sortOption = { 'replies.length': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const posts = await Post.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin - Get all posts (without filtering by status or category)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name image')
      .populate('replies.author', 'name image')
      .sort({ createdAt: -1 }); // Sort by latest
    res.json(posts);
  } catch (error) {
    console.error('Error fetching all posts for admin:', error);
    res.status(500).json({ error: 'Failed to fetch all posts' });
  }
};

// Get a single post by ID
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image')
      .populate('likes', 'name image')
      .populate('dislikes', 'name image');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Normalize category to lowercase before saving
    const normalizedCategory = category.toLowerCase();

    const post = new Post({
      title,
      content,
      category: normalizedCategory,
      author: req.user._id
    });

    await post.save();

    // Add the post reference to the user's threads array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { threads: post._id } },
      { new: true }
    );

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name image');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    post.title = title;
    post.content = content;
    post.category = category;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author or an admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await post.deleteOne();

    // Remove the post reference from the user's threads array
    await User.findByIdAndUpdate(
      post.author,
      { $pull: { threads: post._id } },
      { new: true }
    );

    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all distinct categories
exports.getDistinctCategories = async (req, res) => {
  try {
    const categories = await Post.aggregate([
      { $project: { category: { $toLower: "$category" } } },
      { $group: { _id: "$category" } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: "$_id" } }
    ]);
    res.json(categories.map(cat => cat.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a reply to a post
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create the reply with proper number initialization
    const newReply = {
      content,
      author: req.user._id,
      likes: { count: 0, users: [] },
      dislikes: { count: 0, users: [] },
      userLiked: false,
      userDisliked: false,
      createdAt: new Date()
    };

    post.replies.push(newReply);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: error.message });
  }
};

// Like or unlike a post
exports.toggleLike = async (req, res) => {
  try {
    console.log('toggleLike called:', { user: req.user?._id, postId: req.params.id });
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;

    if (!post) {
      console.error('toggleLike: Post not found', req.params.id);
      return res.status(404).json({ error: 'Post not found' });
    }

    // Initialize if not exists or not in expected format
    if (!post.likes || !Array.isArray(post.likes.users)) {
        post.likes = { count: 0, users: [] };
    }
    if (!post.dislikes || !Array.isArray(post.dislikes.users)) {
        post.dislikes = { count: 0, users: [] };
    }

    const hasLiked = post.likes.users.includes(userId);
    const hasDisliked = post.dislikes.users.includes(userId);

    // Toggle like
    if (hasLiked) {
      // Remove like
      post.likes.users = post.likes.users.filter(id => !id.equals(userId));
      post.likes.count = Math.max(0, post.likes.count - 1);
    } else {
      // Add like
      post.likes.users.push(userId);
      post.likes.count += 1;

      // Remove dislike if exists
      if (hasDisliked) {
        post.dislikes.users = post.dislikes.users.filter(id => !id.equals(userId));
        post.dislikes.count = Math.max(0, post.dislikes.count - 1);
      }
    }

    await post.save();

    res.json({
      likes: post.likes ? post.likes.count : 0,
      dislikes: post.dislikes ? post.dislikes.count : 0,
      userLiked: post.likes && post.likes.users ? post.likes.users.includes(userId) : false,
      userDisliked: post.dislikes && post.dislikes.users ? post.dislikes.users.includes(userId) : false
    });
  } catch (error) {
    console.error('Error toggling like:', error.stack, { user: req.user?._id, postId: req.params.id });
    res.status(500).json({ error: error.message });
  }
};

// Dislike or un-dislike a post
exports.toggleDislike = async (req, res) => {
  try {
    console.log('toggleDislike called:', { user: req.user?._id, postId: req.params.id });
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;

    if (!post) {
      console.error('toggleDislike: Post not found', req.params.id);
      return res.status(404).json({ error: 'Post not found' });
    }

    // Initialize if not exists or not in expected format
    if (!post.likes || !Array.isArray(post.likes.users)) {
        post.likes = { count: 0, users: [] };
    }
    if (!post.dislikes || !Array.isArray(post.dislikes.users)) {
        post.dislikes = { count: 0, users: [] };
    }

    const hasLiked = post.likes.users.includes(userId);
    const hasDisliked = post.dislikes.users.includes(userId);

    // Toggle dislike
    if (hasDisliked) {
      // Remove dislike
      post.dislikes.users = post.dislikes.users.filter(id => !id.equals(userId));
      post.dislikes.count = Math.max(0, post.dislikes.count - 1);
    } else {
      // Add dislike
      post.dislikes.users.push(userId);
      post.dislikes.count += 1;

      // Remove like if exists
      if (hasLiked) {
        post.likes.users = post.likes.users.filter(id => !id.equals(userId));
        post.likes.count = Math.max(0, post.likes.count - 1);
      }
    }

    await post.save();

    res.json({
      likes: post.likes ? post.likes.count : 0,
      dislikes: post.dislikes ? post.dislikes.count : 0,
      userLiked: post.likes && post.likes.users ? post.likes.users.includes(userId) : false,
      userDisliked: post.dislikes && post.dislikes.users ? post.dislikes.users.includes(userId) : false
    });
  } catch (error) {
    console.error('Error toggling dislike:', error.stack, { user: req.user?._id, postId: req.params.id });
    res.status(500).json({ error: error.message });
  }
};

// Toggle like on a reply
exports.toggleReplyLike = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Ensure likes has the correct structure, explicitly replacing if it's an array or malformed
    if (!reply.likes || typeof reply.likes !== 'object' || reply.likes === null || Array.isArray(reply.likes) || typeof reply.likes.count !== 'number' || !Array.isArray(reply.likes.users)) {
        reply.likes = { count: 0, users: [] };
    }
    // Ensure dislikes has the correct structure, explicitly replacing if it's an array or malformed
    if (!reply.dislikes || typeof reply.dislikes !== 'object' || reply.dislikes === null || Array.isArray(reply.dislikes) || typeof reply.dislikes.count !== 'number' || !Array.isArray(reply.dislikes.users)) {
        reply.dislikes = { count: 0, users: [] };
    }

    const hasLiked = reply.likes.users.some(user => user.equals(userId));
    const hasDisliked = reply.dislikes.users.some(user => user.equals(userId));

    // Toggle like
    if (hasLiked) {
      // Remove like
      reply.likes.users = reply.likes.users.filter(id => !id.equals(userId));
      reply.likes.count = Math.max(0, reply.likes.count - 1);
    } else {
      // Add like
      reply.likes.users.push(userId);
      reply.likes.count += 1;

      // Remove dislike if exists
      if (hasDisliked) {
        reply.dislikes.users = reply.dislikes.users.filter(id => !id.equals(userId));
        reply.dislikes.count = Math.max(0, reply.dislikes.count - 1);
      }
    }

    await post.save();

    res.json({
      likes: reply.likes.count,
      dislikes: reply.dislikes.count,
      userLiked: reply.likes.users.some(user => user.equals(userId)),
      userDisliked: reply.dislikes.users.some(user => user.equals(userId))
    });
  } catch (error) {
    console.error('Error toggling reply like:', error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle dislike on a reply
exports.toggleReplyDislike = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Ensure likes has the correct structure, explicitly replacing if it's an array or malformed
    if (!reply.likes || typeof reply.likes !== 'object' || reply.likes === null || Array.isArray(reply.likes) || typeof reply.likes.count !== 'number' || !Array.isArray(reply.likes.users)) {
        reply.likes = { count: 0, users: [] };
    }
    // Ensure dislikes has the correct structure, explicitly replacing if it's an array or malformed
    if (!reply.dislikes || typeof reply.dislikes !== 'object' || reply.dislikes === null || Array.isArray(reply.dislikes) || typeof reply.dislikes.count !== 'number' || !Array.isArray(reply.dislikes.users)) {
        reply.dislikes = { count: 0, users: [] };
    }

    const hasLiked = reply.likes.users.some(user => user.equals(userId));
    const hasDisliked = reply.dislikes.users.some(user => user.equals(userId));

    // Toggle dislike
    if (hasDisliked) {
      // Remove dislike
      reply.dislikes.users = reply.dislikes.users.filter(id => !id.equals(userId));
      reply.dislikes.count = Math.max(0, reply.dislikes.count - 1);
    } else {
      // Add dislike
      reply.dislikes.users.push(userId);
      reply.dislikes.count += 1;

      // Remove like if exists
      if (hasLiked) {
        reply.likes.users = reply.likes.users.filter(id => !id.equals(userId));
        reply.likes.count = Math.max(0, reply.likes.count - 1);
      }
    }

    await post.save();

    res.json({
      likes: reply.likes.count,
      dislikes: reply.dislikes.count,
      userLiked: reply.likes.users.some(user => user.equals(userId)),
      userDisliked: reply.dislikes.users.some(user => user.equals(userId))
    });
  } catch (error) {
    console.error('Error toggling reply dislike:', error);
    res.status(500).json({ error: error.message });
  }
};

// Save a post
exports.savePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.savedPosts.map(id => id.toString()).includes(postId.toString())) {
      user.savedPosts.push(postId);
      await user.save();
      console.log(`Post ${postId} saved for user ${userId}`);
    } else {
      console.log(`Post ${postId} already saved for user ${userId}`);
    }
    res.json({ message: 'Post saved', savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Failed to save post' });
  }
};

// Unsave a post
exports.unsavePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId.toString());
    await user.save();
    console.log(`Post ${postId} unsaved for user ${userId}`);
    res.json({ message: 'Post unsaved' });
  } catch (error) {
    console.error('Error unsaving post:', error);
    res.status(500).json({ error: 'Failed to unsave post' });
  }
};

// Check if post is saved by user
exports.checkSavedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const saved = user.savedPosts.map(id => id.toString()).includes(postId.toString());
    res.json({ saved });
  } catch (error) {
    console.error('Error checking saved post:', error);
    res.status(500).json({ error: 'Failed to check saved post' });
  }
};

// Save a reply to a post
exports.saveReply = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id;

    // Find the user and add the saved reply if not already present
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const replyExists = user.savedReplies.some(item =>
      item.postId.toString() === postId && item.replyId.toString() === replyId
    );

    if (replyExists) {
      return res.status(200).json({ message: 'Reply already saved' });
    }

    user.savedReplies.push({ postId, replyId });
    await user.save();

    res.status(200).json({ message: 'Reply saved successfully!', saved: true });
  } catch (error) {
    console.error('Error saving reply:', error);
    res.status(500).json({ error: error.message });
  }
};

// Unsave a reply from a post
exports.unsaveReply = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id;

    // Find the user and remove the saved reply
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.savedReplies = user.savedReplies.filter(item =>
      !(item.postId.toString() === postId && item.replyId.toString() === replyId)
    );
    await user.save();

    res.status(200).json({ message: 'Reply unsaved successfully!', saved: false });
  } catch (error) {
    console.error('Error unsaving reply:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check if a reply is saved
exports.checkReplySaved = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isSaved = user.savedReplies.some(item =>
      item.postId.toString() === postId && item.replyId.toString() === replyId
    );

    res.status(200).json({ saved: isSaved });
  } catch (error) {
    console.error('Error checking reply saved status:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get trending categories based on number of comments (replies), considering recent comment activity
exports.getTrendingCategories = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // Calculate time range
    const now = new Date();
    let timeThreshold;
    switch (timeRange) {
      case '24h':
        timeThreshold = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        timeThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        timeThreshold = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        timeThreshold = new Date(now - 24 * 60 * 60 * 1000);
    }

    // Aggregate to get categories with their total comments and post counts
    const trendingCategories = await Post.aggregate([
      { $match: {
          status: 'active',
          $or: [
            { createdAt: { $gte: timeThreshold } },
            { 'replies.createdAt': { $gte: timeThreshold } }
          ]
        }
      },
      { $group: {
          _id: '$category',
          totalComments: { $sum: { $size: '$replies' } },
          postCount: { $sum: 1 },
          latestPost: { $max: '$createdAt' }
        }
      },
      { $sort: { totalComments: -1, latestPost: -1 } },
      { $limit: 10 },
      { $project: {
          _id: 0,
          name: '$_id',
          totalComments: 1,
          postCount: 1,
          latestPost: 1
        }
      }
    ]);

    res.json(trendingCategories);
  } catch (error) {
    console.error('Error getting trending categories:', error);
    res.status(500).json({ error: 'Failed to get trending categories' });
  }
}; 