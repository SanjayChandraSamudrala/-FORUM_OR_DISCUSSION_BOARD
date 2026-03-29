const Post = require('../models/Post');
const User = require('../models/User');
const Community = require('../models/Community');

exports.search = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const searchRegex = new RegExp(query, 'i'); // Case-insensitive search

    // Search in Posts (title and content)
    const posts = await Post.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex }
      ]
    }).populate('author', 'name image');

    // Search in Users (name and email)
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    }).select('-password'); // Exclude password

    // Search in Communities (name and description)
    const communities = await Community.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    });

    res.json({
      posts,
      users,
      communities
    });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Failed to perform search.' });
  }
}; 