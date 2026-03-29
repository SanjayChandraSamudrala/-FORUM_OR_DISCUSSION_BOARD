const jwt = require('jsonwebtoken');
const User = require('../models/User');

const admin = async (req, res, next) => {
  // auth middleware must run before this to ensure req.user is populated
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin role required' });
  }

  next();
};

module.exports = admin; 