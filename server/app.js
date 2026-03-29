const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const postRoutes = require('./routes/postRoutes');
const trendingRoutes = require('./routes/trendingRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const communityRoutes = require('./routes/communityRoutes');
const searchRoutes = require('./routes/searchRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const connectAdminDb = require('./config/adminDb');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Connect to Admin Database
connectAdminDb()
  .then(() => console.log('Admin database connection established'))
  .catch(err => console.error('Admin database connection error:', err));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/search', searchRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 