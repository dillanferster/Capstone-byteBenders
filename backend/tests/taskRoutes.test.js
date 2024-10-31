import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import taskRoutes from "../taskRoutes.js";

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/", taskRoutes);

// Define mocks
const mockCollection = {
  find: vi.fn().mockReturnThis(),
  findOne: vi.fn(),
  insertOne: vi.fn(),
  updateOne: vi.fn(),
  deleteOne: vi.fn(),
  toArray: vi.fn(),
};

const mockDb = {
  collection: vi.fn(() => mockCollection),
};

// Mock the connect module
vi.mock("../connect.js", () => ({
  getDb: () => mockDb,
}));

// Mock auth middleware
vi.mock("../middleware/auth.js", () => ({
  verifyToken: (req, res, next) => next(),
}));

describe("Task Routes", () => {
  const mockTask = {
    _id: "507f1f77bcf86cd799439011",
    assignedTo: "test@example.com",
    taskName: "Test Task",
    taskStatus: "In Progress",
    priority: "High",
    taskCategory: "Development",
    startDate: "2024-01-01T00:00:00.000Z",
    dueDate: "2024-01-02T00:00:00.000Z",
    taskDesc: "Test Description",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      mockCollection.toArray.mockResolvedValue([mockTask]);

      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockTask]);
    });

    it("should handle error when no tasks exist", async () => {
      mockCollection.toArray.mockResolvedValue([]);

      const response = await request(app).get("/tasks");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "data was not found" });
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return single task by id", async () => {
      mockCollection.findOne.mockResolvedValue(mockTask);

      const response = await request(app).get(`/tasks/${mockTask._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTask);
    });

    it("should return 404 when task not found", async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const response = await request(app).get(`/tasks/${mockTask._id}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Task not found" });
    });
  });

  describe("POST /tasks", () => {
    it("should create new task", async () => {
      const newTask = { ...mockTask };
      delete newTask._id;

      mockCollection.insertOne.mockResolvedValue({
        acknowledged: true,
        insertedId: mockTask._id,
      });

      const response = await request(app).post("/tasks").send(newTask);

      expect(response.status).toBe(200);
      expect(response.body.acknowledged).toBe(true);
      expect(response.body.insertedId).toBe(mockTask._id);
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update existing task", async () => {
      mockCollection.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      const response = await request(app)
        .put(`/tasks/${mockTask._id}`)
        .send(mockTask);

      expect(response.status).toBe(200);
      expect(response.body.matchedCount).toBe(1);
      expect(response.body.modifiedCount).toBe(1);
    });
  });
});
