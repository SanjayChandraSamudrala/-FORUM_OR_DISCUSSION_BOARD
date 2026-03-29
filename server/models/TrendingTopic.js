const mongoose = require('mongoose');

const trendingTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true,
    index: true // Add index for better query performance
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  trendingScore: {
    type: Number,
    default: 0
  },
  trendingRank: {
    type: Number
  },
  status: {
    type: String,
    enum: ['rising', 'trending', 'falling', 'archived'],
    default: 'rising'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps before saving
trendingTopicSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Update lastActivityAt if there's new activity (new replies, likes, etc.)
  if (this.isModified('replies') || this.isModified('likes') || this.isModified('dislikes')) {
    this.lastActivityAt = Date.now();
  }
  
  next();
});

// Calculate trending score
trendingTopicSchema.methods.calculateTrendingScore = function() {
  const now = Date.now();
  const hoursAge = (now - this.createdAt) / (1000 * 60 * 60);
  const likesWeight = 1.5;
  const repliesWeight = 2;
  const viewsWeight = 0.5;
  
  this.trendingScore = (
    (this.likes.length * likesWeight + 
    this.replies.length * repliesWeight + 
    this.views * viewsWeight) / 
    Math.pow(hoursAge + 2, 1.8)
  );
  
  return this.trendingScore;
};

// Add indexes for better query performance
trendingTopicSchema.index({ trendingScore: -1, createdAt: -1 });
trendingTopicSchema.index({ status: 1, createdAt: -1 });
trendingTopicSchema.index({ topic: 1, createdAt: -1 }); // Add index for topic queries
trendingTopicSchema.index({ tags: 1 });
trendingTopicSchema.index({ author: 1 });

module.exports = mongoose.model('TrendingTopic', trendingTopicSchema); 