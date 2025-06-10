const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');

// Load environment variables
dotenv.config();
const email = "sanjaychandra435@gmail.com";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // 1. Find the user
  const user = await User.findOne({ email });
  if (!user) {
    console.error("User not found");
    process.exit(1);
  }

  // 2. Update role to admin if not already
  let updated = false;
  if (user.role !== "admin") {
    user.role = "admin";
    await user.save();
    updated = true;
    console.log("User role updated to admin.");
  } else {
    console.log("User is already admin.");
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
    console.log("Admin log entry created.");
  } else {
    console.log("Admin log entry already exists.");
  }

  process.exit(0);
}

run(); 