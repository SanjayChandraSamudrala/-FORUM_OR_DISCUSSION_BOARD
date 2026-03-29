const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Update lastActiveAt timestamp
    user.lastActiveAt = Date.now();
    await user.save();

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is invalid' });
  }
};

module.exports = auth; 