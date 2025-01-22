const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  updateProfile,
  changePassword,
  deleteAccount,
  getUserStats,
} = require("../controllers/user.controller");

// All routes require authentication

router.use(auth);

//Profile management

router.put("/profile", updateProfile);
router.patch("/change-password", changePassword);
router.delete("/profile", deleteAccount);

// User statistics
router.get("/stats", getUserStats);

module.exports = router;
