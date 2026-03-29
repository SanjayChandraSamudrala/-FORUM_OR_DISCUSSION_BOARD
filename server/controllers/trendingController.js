const TrendingTopic = require('../models/TrendingTopic');
const User = require('../models/User');

// Get trending topics
exports.getTrendingTopics = async (req, res) => {
  try {
    const {
      timeRange = '24h',
      page = 1,
      limit = 10,
      status = ['rising', 'trending'],
      topic
    } = req.query;

    // Calculate time range
    const now = new Date();
    let timeFilter = {};
    switch (timeRange) {
      case '24h':
        timeFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        timeFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        timeFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        timeFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
    }

    // Build query
    const query = {
      ...timeFilter,
      status: { $in: Array.isArray(status) ? status : [status] }
    };

    // Add topic filter if specified
    if (topic) {
      query.topic = topic;
    }

    // Get topics and update trending scores
    const topics = await TrendingTopic.find(query)
      .sort({ trendingScore: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    // Update trending scores and ranks
    for (let i = 0; i < topics.length; i++) {
      topics[i].calculateTrendingScore();
      topics[i].trendingRank = i + 1;
      await topics[i].save();
    }

    const total = await TrendingTopic.countDocuments(query);

    res.json({
      topics,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTopics: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single trending topic
exports.getTrendingTopic = async (req, res) => {
  try {
    const topic = await TrendingTopic.findById(req.params.id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image')
      .populate('likes', 'name image')
      .populate('dislikes', 'name image')
      .populate('replies.likes', 'name image')
      .populate('replies.dislikes', 'name image');

    if (!topic) {
      return res.status(404).json({ error: 'Trending topic not found' });
    }

    // Increment view count and update trending score
    topic.views += 1;
    topic.calculateTrendingScore();
    await topic.save();

    // Add userLiked and userDisliked flags to replies
    const userId = req.user?._id;
    if (userId) {
      topic.replies = topic.replies.map(reply => ({
        ...reply.toObject(),
        userLiked: reply.likes.some(like => like._id.toString() === userId.toString()),
        userDisliked: reply.dislikes.some(dislike => dislike._id.toString() === userId.toString())
      }));
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new trending topic
exports.createTrendingTopic = async (req, res) => {
  try {
    const { title, content, topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const newTopic = new TrendingTopic({
      title,
      content,
      topic,
      author: req.user._id
    });

    await newTopic.save();

    const populatedTopic = await TrendingTopic.findById(newTopic._id)
      .populate('author', 'name image');

    res.status(201).json(populatedTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a trending topic
exports.updateTrendingTopic = async (req, res) => {
  try {
    const { title, content, topic } = req.body;
    const existingTopic = await TrendingTopic.findById(req.params.id);

    if (!existingTopic) {
      return res.status(404).json({ error: 'Trending topic not found' });
    }

    // Check if user is the author
    if (existingTopic.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    existingTopic.title = title;
    existingTopic.content = content;
    if (topic) {
      existingTopic.topic = topic;
    }

    await existingTopic.save();

    const updatedTopic = await TrendingTopic.findById(existingTopic._id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a trending topic
exports.deleteTrendingTopic = async (req, res) => {
  try {
    const topic = await TrendingTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ error: 'Trending topic not found' });
    }

    // Check if user is the author
    if (topic.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await topic.remove();
    res.json({ message: 'Trending topic removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a reply to a trending topic
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const topic = await TrendingTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ error: 'Trending topic not found' });
    }

    const newReply = {
      content,
      author: req.user._id,
      likes: [],
      dislikes: [],
      createdAt: new Date()
    };

    topic.replies.push(newReply);

    // Update trending score after new reply
    topic.calculateTrendingScore();
    await topic.save();

    // Get the newly added reply
    const savedTopic = await TrendingTopic.findById(topic._id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    const addedReply = savedTopic.replies[savedTopic.replies.length - 1];

    // Return the reply data in the format expected by the frontend
    res.json({
      _id: addedReply._id,
      content: addedReply.content,
      author: addedReply.author,
      createdAt: addedReply.createdAt,
      likes: addedReply.likes || [],
      dislikes: addedReply.dislikes || [],
      userLiked: false,
      userDisliked: false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like or unlike a trending topic
exports.toggleLike = async (req, res) => {
  try {
    const topic = await TrendingTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Trending topic not found' });
    }

    const userId = req.user._id;
    const userLiked = topic.likes.includes(userId);

    let message;
    if (userLiked) {
      topic.likes.pull(userId);
      message = 'Like removed';
    } else {
      // If user disliked, remove dislike first
      topic.dislikes.pull(userId);
      topic.likes.push(userId);
      message = 'Post liked';
    }

    await topic.save();

    // Populate topic with updated likes/dislikes to send back correct counts
    const updatedTopic = await TrendingTopic.findById(topic._id)
      .populate('likes', 'name image')
      .populate('dislikes', 'name image');

    res.status(200).json({
      likes: updatedTopic.likes.length,
      dislikes: updatedTopic.dislikes.length,
      userLiked: !userLiked, // Correctly reflect the new state
      userDisliked: updatedTopic.dislikes.some(d => d._id.toString() === userId.toString()),
      message,
    });
  } catch (error) {
    console.error('Error toggling like on trending topic:', error);
    res.status(500).json({ error: error.message });
  }
};

// Dislike or un-dislike a trending topic
exports.toggleDislike = async (req, res) => {
  try {
    const topic = await TrendingTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ error: 'Trending topic not found' });
    }

    const userId = req.user._id;
    const userDisliked = topic.dislikes.includes(userId);

    let message;
    if (userDisliked) {
      topic.dislikes.pull(userId);
      message = 'Dislike removed';
    } else {
      // If user liked, remove like first
      topic.likes.pull(userId);
      topic.dislikes.push(userId);
      message = 'Post disliked';
    }

    // Update trending score after dislike/un-dislike
    topic.calculateTrendingScore();
    await topic.save();

    // Populate topic with updated likes/dislikes to send back correct counts
    const updatedTopic = await TrendingTopic.findById(topic._id)
      .populate('likes', 'name image')
      .populate('dislikes', 'name image');

    res.status(200).json({
      likes: updatedTopic.likes.length,
      dislikes: updatedTopic.dislikes.length,
      userLiked: updatedTopic.likes.some(l => l._id.toString() === userId.toString()),
      userDisliked: !userDisliked, // Correctly reflect the new state
      message,
    });
  } catch (error) {
    console.error('Error toggling dislike on trending topic:', error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle like on a reply
exports.toggleReplyLike = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const userId = req.user._id;
    const topic = await TrendingTopic.findById(id);

    if (!topic) {
      return res.status(404).json({ error: 'Trending topic not found' });
    }

    const reply = topic.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const likeIndex = reply.likes.indexOf(userId);
    if (likeIndex > -1) {
      reply.likes.splice(likeIndex, 1);
    } else {
      reply.likes.push(userId);
      // Remove from dislikes if exists
      const dislikeIndex = reply.dislikes.indexOf(userId);
      if (dislikeIndex > -1) {
        reply.dislikes.splice(dislikeIndex, 1);
      }
    }

    // Update trending score after like/unlike
    topic.calculateTrendingScore();
    await topic.save();

    res.json({
      likes: reply.likes.length,
      dislikes: reply.dislikes.length,
      userLiked: reply.likes.includes(userId),
      userDisliked: reply.dislikes.includes(userId)
    });
  } catch (error) {
    console.error('Error toggling reply like:', error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle dislike on a reply
exports.toggleReplyDislike = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const userId = req.user._id;
    const topic = await TrendingTopic.findById(id);

    if (!topic) {
      return res.status(404).json({ error: 'Trending topic not found' });
    }

    const reply = topic.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const dislikeIndex = reply.dislikes.indexOf(userId);
    if (dislikeIndex > -1) {
      reply.dislikes.splice(dislikeIndex, 1);
    } else {
      reply.dislikes.push(userId);
      // Remove from likes if exists
      const likeIndex = reply.likes.indexOf(userId);
      if (likeIndex > -1) {
        reply.likes.splice(likeIndex, 1);
      }
    }

    // Update trending score after dislike/un-dislike
    topic.calculateTrendingScore();
    await topic.save();

    res.json({
      likes: reply.likes.length,
      dislikes: reply.dislikes.length,
      userLiked: reply.likes.includes(userId),
      userDisliked: reply.dislikes.includes(userId)
    });
  } catch (error) {
    console.error('Error toggling reply dislike:', error);
    res.status(500).json({ error: error.message });
  }
};

// Save a trending topic
exports.saveTrendingTopic = async (req, res) => {
  try {
    const userId = req.user._id;
    const topicId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.savedTrendingTopics.map(id => id.toString()).includes(topicId.toString())) {
      user.savedTrendingTopics.push(topicId);
      await user.save();
      console.log(`Trending topic ${topicId} saved for user ${userId}`);
    } else {
      console.log(`Trending topic ${topicId} already saved for user ${userId}`);
    }
    res.json({ message: 'Trending topic saved', savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving trending topic:', error);
    res.status(500).json({ error: 'Failed to save trending topic' });
  }
};

// Unsave a trending topic
exports.unsaveTrendingTopic = async (req, res) => {
  try {
    const userId = req.user._id;
    const topicId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.savedTrendingTopics = user.savedTrendingTopics.filter(id => id.toString() !== topicId.toString());
    await user.save();
    console.log(`Trending topic ${topicId} unsaved for user ${userId}`);
    res.json({ message: 'Trending topic unsaved' });
  } catch (error) {
    console.error('Error unsaving trending topic:', error);
    res.status(500).json({ error: 'Failed to unsave trending topic' });
  }
};

// Save a trending reply
exports.saveTrendingReply = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topicId, replyId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Store reply with parent topic ID
     const replyRef = { replyId, topicId };
    if (!user.savedTrendingReplies.some(r => r.replyId.toString() === replyId.toString())) {
      user.savedTrendingReplies.push(replyRef);
      await user.save();
      console.log(`Trending reply ${replyId} from topic ${topicId} saved for user ${userId}`);
    } else {
      console.log(`Trending reply ${replyId} from topic ${topicId} already saved for user ${userId}`);
    }
    res.json({ message: 'Trending reply saved' });
  } catch (error) {
    console.error('Error saving trending reply:', error);
    res.status(500).json({ error: 'Failed to save trending reply' });
  }
};

// Unsave a trending reply
exports.unsaveTrendingReply = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topicId, replyId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.savedTrendingReplies = user.savedTrendingReplies.filter(r => r.replyId.toString() !== replyId.toString());
    await user.save();
    console.log(`Trending reply ${replyId} from topic ${topicId} unsaved for user ${userId}`);
    res.json({ message: 'Trending reply unsaved' });
  } catch (error) {
    console.error('Error unsaving trending reply:', error);
    res.status(500).json({ error: 'Failed to unsave trending reply' });
  }
};

// Check if trending topic is saved
exports.checkTrendingTopicSaved = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isSaved = user.savedTrendingTopics.some(item => item.toString() === id);

    res.status(200).json({ saved: isSaved });
  } catch (error) {
    console.error('Error checking trending topic saved status:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check if trending reply is saved
exports.checkTrendingReplySaved = async (req, res) => {
  try {
    const { topicId, replyId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isSaved = user.savedTrendingReplies.some(item =>
      item.topicId.toString() === topicId && item.replyId.toString() === replyId
    );

    res.status(200).json({ saved: isSaved });
  } catch (error) {
    console.error('Error checking trending reply saved status:', error);
    res.status(500).json({ error: error.message });
  }
}; 