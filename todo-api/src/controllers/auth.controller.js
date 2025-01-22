// src/controllers/auth.controller.js
const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data and token (excluding password)
    const userData = user.toJSON();
    delete userData.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data and token (excluding password)
    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error during login" });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userData = req.user.toJSON();
    delete userData.password;

    res.json({ user: userData });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
