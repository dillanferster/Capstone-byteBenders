import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import calendarRoutes from "../calendarRoutes.js";

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/", calendarRoutes);

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

describe("Calendar Routes", () => {
  const mockEvent = {
    _id: "507f1f77bcf86cd799439011",
    title: "Test Event",
    start: "2024-01-01T00:00:00.000Z",
    end: "2024-01-02T00:00:00.000Z",
    description: "Test Description",
    meetingLink: "https://meet.test",
    participants: ["test@example.com"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /events", () => {
    it("should return all events", async () => {
      mockCollection.toArray.mockResolvedValue([mockEvent]);

      const response = await request(app).get("/events");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockEvent]);
    });

    it("should return empty array when no events exist", async () => {
      mockCollection.toArray.mockResolvedValue([]);

      const response = await request(app).get("/events");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /events/:id", () => {
    it("should return single event by id", async () => {
      mockDb.collection().findOne.mockResolvedValue(mockEvent);

      const response = await request(app).get(`/events/${mockEvent._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
    });

    it("should return 404 when event not found", async () => {
      mockDb.collection().findOne.mockResolvedValue(null);

      const response = await request(app).get(`/events/${mockEvent._id}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Event not found" });
    });
  });

  describe("POST /events", () => {
    it("should create new event", async () => {
      const newEvent = { ...mockEvent };
      delete newEvent._id;

      mockDb.collection().insertOne.mockResolvedValue({
        acknowledged: true,
        insertedId: mockEvent._id,
      });

      const response = await request(app).post("/events").send(newEvent);

      expect(response.status).toBe(200);
      expect(response.body.acknowledged).toBe(true);
    });
  });

  describe("PUT /events/:id", () => {
    it("should update existing event", async () => {
      mockDb.collection().updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      const response = await request(app)
        .put(`/events/${mockEvent._id}`)
        .send(mockEvent);

      expect(response.status).toBe(200);
      expect(response.body.matchedCount).toBe(1);
    });

    it("should return 404 when event not found", async () => {
      mockDb.collection().updateOne.mockResolvedValue({ matchedCount: 0 });

      const response = await request(app)
        .put(`/events/${mockEvent._id}`)
        .send(mockEvent);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Event not found" });
    });
  });

  describe("DELETE /events/:id", () => {
    it("should delete existing event", async () => {
      mockDb.collection().deleteOne.mockResolvedValue({ deletedCount: 1 });

      const response = await request(app).delete(`/events/${mockEvent._id}`);

      expect(response.status).toBe(200);
      expect(response.body.deletedCount).toBe(1);
    });

    it("should return 404 when event not found", async () => {
      mockDb.collection().deleteOne.mockResolvedValue({ deletedCount: 0 });

      const response = await request(app).delete(`/events/${mockEvent._id}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Event not found" });
    });
  });
});
