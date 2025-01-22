// src/config/init.js
const sequelize = require("./database");
const User = require("../models/user");
const Todo = require("../models/todo");

const initializeDatabase = async () => {
  try {
    // Force: true will drop the table if it already exists
    // In production, you should use force: false
    await sequelize.sync({ force: true });
    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
