const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    // check if authHeader is present
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "No Authentication token provided" });
    }

    // Check if it follows Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Now Extract token
    const token = authHeader.replace("Bearer ", "");
    //console.log("Extracted token", token);

    try {
      // verify token
      const decoded = await verifyToken(token);
      console.log(decoded);

      // Find User
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        throw new Error("User not found");
      }
      // Add user to the request object
      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Invalid authentication token" });
    }
  } catch (err) {
    console.error("Auth middleware error ", err);
    res.status(500).json({ error: "Server error in authentication" });
  }
};

// Create middleware for specific roles
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .statu(403)
      .json({ error: "Access denied Admin privileges required " });
  }
};

module.exports = { auth };
