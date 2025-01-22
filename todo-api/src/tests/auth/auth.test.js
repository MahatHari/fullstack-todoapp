const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");

describe("Auth Endpoints", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
  };

  describe("POST /api/auth/register", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(201);
    });
  });
});
