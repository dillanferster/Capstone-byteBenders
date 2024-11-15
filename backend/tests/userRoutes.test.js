import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import userRoutes from "../userRoutes.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/", userRoutes);

// Mock bcrypt
vi.mock("bcrypt", () => ({
  hash: vi.fn().mockResolvedValue("hashedPassword123"),
  compare: vi.fn(),
}));

// Mock jwt
vi.mock("jsonwebtoken", () => ({
  sign: vi.fn().mockReturnValue("mockToken123"),
}));

// Define mocks
const mockCollection = {
  findOne: vi.fn(),
  insertOne: vi.fn(),
};

const mockDb = {
  collection: vi.fn(() => mockCollection),
};

// Mock the database connection
vi.mock("../connect.js", () => ({
  getDb: () => mockDb, // Export the getDb function directly
}));

// Mock auth middleware
vi.mock("../middleware/auth.js", () => ({
  verifyToken: (req, res, next) => next(),
}));

describe("User Routes", () => {
  const mockUser = {
    fname: "John",
    lname: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    joinDate: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /users (Registration)", () => {
    it("should register a new user successfully", async () => {
      // Mock that email is not taken
      mockCollection.findOne.mockResolvedValueOnce(null);

      // Mock successful insertion
      mockCollection.insertOne.mockResolvedValueOnce({
        acknowledged: true,
        insertedId: "123",
      });

      const response = await request(app).post("/users").send(mockUser);

      expect(response.status).toBe(200);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        fname: mockUser.fname,
        lname: mockUser.lname,
        email: mockUser.email,
        password: "hashedPassword123",
        role: mockUser.role,
        joinDate: expect.any(Date),
      });
    });

    it("should return 409 if email is already taken", async () => {
      // Mock that email is already taken
      mockCollection.findOne.mockResolvedValueOnce({ email: mockUser.email });

      const response = await request(app).post("/users").send(mockUser);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "Email already in use. Please enter another email."
      );
      expect(mockCollection.insertOne).not.toHaveBeenCalled();
    });
  });

  describe("POST /users/login", () => {
    it("should login successfully with correct credentials", async () => {
      const existingUser = {
        ...mockUser,
        password: "hashedPassword123",
      };

      // Mock user found
      mockCollection.findOne.mockResolvedValueOnce(existingUser);
      // Mock successful password comparison
      bcrypt.compare.mockResolvedValueOnce(true);

      const response = await request(app).post("/users/login").send({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        token: "mockToken123",
        message: "User exists",
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        existingUser,
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
    });

    it("should return error for non-existent user", async () => {
      // Mock user not found
      mockCollection.findOne.mockResolvedValueOnce(null);

      const response = await request(app).post("/users/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: "User not found",
      });
    });

    it("should return error for incorrect password", async () => {
      const existingUser = {
        ...mockUser,
        password: "hashedPassword123",
      };

      // Mock user found but password comparison fails
      mockCollection.findOne.mockResolvedValueOnce(existingUser);
      bcrypt.compare.mockResolvedValueOnce(false);

      const response = await request(app).post("/users/login").send({
        email: mockUser.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: "Incorrect password",
      });
    });
  });
});
