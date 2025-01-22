const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Todo = require("../models/todo");
const sequelize = require("../config/database");

// update profile
const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, email } = req.body;

    // Check if email is being changed and if its already taken
    if (email && email != user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email alredy in use" });
      }
    }
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
    });

    const userData = user.json();
    delete userData.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Profile update error", error);
    res.status(400).json({ error: error.message });
  }
};

// Change password

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = rq.user;

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    // Update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ password: hashedPassword });

    res.status(200).json({ error: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const user = req.user;

    await user.destroy();

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Account deletion error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get user statistics (like total todos, completed todos, etc.)
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Todo.findAll({
      where: { userId },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    res.json({ stats });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  deleteAccount,
  getUserStats,
};
