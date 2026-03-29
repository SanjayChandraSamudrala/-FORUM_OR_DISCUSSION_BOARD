const mongoose = require('mongoose');

const connectAdminDb = async () => {
  try {
    const adminDbUri = process.env.ADMIN_MONGODB_URI || process.env.MONGODB_URI;
    await mongoose.createConnection(adminDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'admin_db'
    });
    console.log('Connected to Admin Database');
  } catch (error) {
    console.error('Admin Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectAdminDb; 