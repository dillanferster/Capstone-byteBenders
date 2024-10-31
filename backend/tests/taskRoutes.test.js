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
  default: {
    getDb: () => mockDb,
  },
}));

// Mock auth middleware
vi.mock("../middleware/auth.js", () => ({
  verifyToken: (req, res, next) => next(),
}));

describe("Task Routes", () => {
  const mockTask = {
    _id: "507f1f77bcf86cd799439011",
    assignedTo: "dillan",
    taskName: "Test Task",
    taskStatus: "not started",
    priority: "High",
    taskCategory: "Development",
    startDate: "2024-01-01T00:00:00.000Z",
    dueDate: "2024-01-02T00:00:00.000Z",
    projectStatus: "in progress",
    projectTask: "Backend",
    addChronicles: 1,
    taskDesc: "Test Description",
    attachments: "link",
    chroniclesComplete: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default successful responses
    mockCollection.find.mockReturnThis();
    mockCollection.toArray.mockResolvedValue([mockTask]);
    mockCollection.findOne.mockResolvedValue(mockTask);
    mockCollection.insertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: mockTask._id,
    });
    mockCollection.updateOne.mockResolvedValue({
      matchedCount: 1,
      modifiedCount: 1,
    });
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      const response = await request(app).get("/tasks").timeout(10000); // Increase timeout

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockTask]);
      expect(mockDb.collection).toHaveBeenCalledWith("FrankTask");
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return single task by id", async () => {
      const response = await request(app)
        .get(`/tasks/${mockTask._id}`)
        .timeout(10000); // Increase timeout

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTask);
    });

    it("should return 404 when task not found", async () => {
      mockCollection.findOne.mockResolvedValueOnce(null);

      const response = await request(app)
        .get(`/tasks/${mockTask._id}`)
        .timeout(10000); // Increase timeout

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Task not found" });
    });
  });

  // create new task
  describe("POST /tasks", () => {
    it("Test id: ADT01-P,should create new task", async () => {
      const newTask = { ...mockTask };
      delete newTask._id;

      // Mock findOne to return null first (for duplicate check)
      mockCollection.findOne.mockResolvedValueOnce(null);

      const response = await request(app)
        .post("/tasks")
        .send(newTask)
        .timeout(10000); // Increase timeout

      expect(response.status).toBe(200);
      expect(response.body.acknowledged).toBe(true);
      expect(response.body.insertedId).toBe(mockTask._id);
    });

    it("Test id: ADT03-N,should return error when task name already exists", async () => {
      const newTask = { ...mockTask };
      delete newTask._id;

      // Mock findOne to return an existing task when checking for duplicates
      mockCollection.findOne.mockResolvedValueOnce({ ...mockTask });

      const response = await request(app)
        .post("/tasks")
        .send(newTask)
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Task name already exists" });
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update existing task", async () => {
      const response = await request(app)
        .put(`/tasks/${mockTask._id}`)
        .send(mockTask)
        .timeout(10000); // Increase timeout

      expect(response.status).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete existing task", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const response = await request(app).delete(`/tasks/${mockTask._id}`);

      expect(response.status).toBe(200);
      expect(response.body.deletedCount).toBe(1);
    });
  });
});
