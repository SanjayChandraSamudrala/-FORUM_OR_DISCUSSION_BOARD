const express = require('express');
const router = express.Router();
const { getDashboardStats, getAdminLogs } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// All routes require authentication and admin role
router.use(auth);
router.use(admin);

// Get admin dashboard statistics
router.get('/dashboard', getDashboardStats);

// Get admin activity logs
router.get('/logs', getAdminLogs);

module.exports = router; 