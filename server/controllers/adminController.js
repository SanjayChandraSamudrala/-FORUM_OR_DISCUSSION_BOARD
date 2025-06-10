const User = require('../models/User');
const AdminLog = require('../models/AdminLog');

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalModerators = await User.countDocuments({ role: 'moderator' });
    
    const recentAdminLogs = await AdminLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('adminId', 'name email');

    // Log the admin action
    await exports.logAdminAction(req.user._id, 'system_settings', 'Accessed admin dashboard statistics');

    res.json({
      totalUsers,
      totalAdmins,
      totalModerators,
      recentAdminLogs
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

// Log admin action
exports.logAdminAction = async (adminId, action, description, details = {}) => {
  try {
    const log = new AdminLog({
      adminId,
      action,
      description,
      details
    });
    await log.save();
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

// Get admin activity logs
exports.getAdminLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, action } = req.query;
    const query = action ? { action } : {};

    const logs = await AdminLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('adminId', 'name email');

    const total = await AdminLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    res.status(500).json({ error: 'Failed to fetch admin logs' });
  }
}; 