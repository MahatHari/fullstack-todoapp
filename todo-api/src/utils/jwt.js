const jwt = require("jsonwebtoken");
require("dotenv").config();
//Generate JWT Token

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// Verify JWT Token

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded token: ", decoded);
    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
};

module.exports = { generateToken, verifyToken };
