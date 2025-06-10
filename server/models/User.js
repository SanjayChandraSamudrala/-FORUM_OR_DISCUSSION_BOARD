const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  image: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  threads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  responses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  savedReplies: [{
    replyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post.replies' },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
  }],
  savedTrendingTopics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrendingTopic'
  }],
  savedTrendingReplies: [{
    replyId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrendingTopic.replies' },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrendingTopic' }
  }],
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generate auth token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema); 