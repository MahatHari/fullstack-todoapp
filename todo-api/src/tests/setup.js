const sequelize = require("../config/database");

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log("Test database connected");
    await sequelize.sync({ force: true });
    console.log("Database synced for testing");
  } catch (error) {
    console.error("Test database connection error:", error);
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database:", error);
  }
});

beforeEach(async () => {
  try {
    await sequelize.truncate({ cascade: true });
  } catch (error) {
    console.error("Error truncating database:", error);
  }
});
