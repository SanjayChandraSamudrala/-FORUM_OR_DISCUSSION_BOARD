const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');

// Load environment variables
dotenv.config();
const emails = ["sanjaychandra435@gmail.com", "roman@gmail.com"];
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  for (const email of emails) {
    console.log(`Processing user: ${email}`);

    // 1. Find the user
    let user = await User.findOne({ email });

    // 1a. If user doesn't exist, create one (for initial admin setup)
    if (!user) {
      console.warn(`User with email ${email} not found. Creating new user with admin role.`);
      user = await User.create({
        name: email.split("@")[0],
        email,
        password: defaultAdminPassword,
        role: "admin"
      });
      console.log(`Created new admin user ${email} (default password: ${defaultAdminPassword}). Please change it immediately.`);
    }

    // 2. Ensure role is admin
    if (user.role !== "admin") {
      user.role = "admin";
      await user.save();
      console.log(`User ${email} role updated to admin.`);
    } else {
      console.log(`User ${email} already has admin role.`);
    }

    // 3. Create an admin log entry (only if not already present)
    const existingLog = await AdminLog.findOne({
      adminId: user._id,
      action: "user_management",
      description: { $regex: user.email }
    });

    if (!existingLog) {
      await AdminLog.create({
        adminId: user._id,
        action: "user_management",
        description: `User ${user.email} promoted to admin via script`,
        details: { promotedBy: "system/script", userId: user._id },
        role: "admin"
      });
      console.log(`Admin log entry created for ${email}.`);
    } else {
      console.log(`Admin log entry already exists for ${email}.`);
    }
  }

  process.exit(0);
}

run(); 