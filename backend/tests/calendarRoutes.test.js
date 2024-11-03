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

  // Existing test cases
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

    // CM014: Test empty calendar handling
    it("should handle empty calendar gracefully", async () => {
      mockCollection.toArray.mockResolvedValue([]);

      const response = await request(app).get("/events");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /events/:id", () => {
    // CM007: View Event Details
    it("should return complete event details by id", async () => {
      mockCollection.findOne.mockResolvedValue(mockEvent);

      const response = await request(app).get(`/events/${mockEvent._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("start");
      expect(response.body).toHaveProperty("end");
      expect(response.body).toHaveProperty("description");
      expect(response.body).toHaveProperty("meetingLink");
      expect(response.body).toHaveProperty("participants");
    });

    it("should return 404 when event not found", async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const response = await request(app).get(`/events/${mockEvent._id}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Event not found" });
    });
  });

  describe("POST /events", () => {
    // CM001: Add Event (Positive)
    it("should create new event with all fields", async () => {
      const newEvent = {
        title: "Test Event",
        start: "2024-12-20T09:00:00.000Z",
        end: "2024-12-20T10:00:00.000Z",
        description: "Test Description",
        meetingLink: "https://teams.microsoft.com/test",
        participants: ["frank.bosse@example.com"],
      };

      mockCollection.insertOne.mockResolvedValue({
        acknowledged: true,
        insertedId: mockEvent._id,
      });

      const response = await request(app).post("/events").send(newEvent);

      expect(response.status).toBe(200);
      expect(response.body.acknowledged).toBe(true);
    });

    // CM002: Add Event (Negative)
    it("should handle missing required fields", async () => {
      const incompleteEvent = {
        start: "2024-12-20T09:00:00.000Z",
        end: "2024-12-20T10:00:00.000Z",
      };

      const response = await request(app).post("/events").send(incompleteEvent);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    // CM003: Add Event (Edge - Invalid Dates)
    it("should handle invalid date range", async () => {
      const invalidEvent = {
        title: "Test",
        start: "2024-12-20T09:00:00.000Z",
        end: "2024-12-11T10:00:00.000Z",
        description: "Test",
      };

      const response = await request(app).post("/events").send(invalidEvent);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    // CM012: Add Event with Maximum Participants
    it("should handle event with large number of participants", async () => {
      const manyParticipants = Array(100)
        .fill()
        .map((_, i) => `user${i}@example.com`);
      const largeEvent = {
        ...mockEvent,
        participants: manyParticipants,
      };

      mockCollection.insertOne.mockResolvedValue({
        acknowledged: true,
        insertedId: mockEvent._id,
      });

      const response = await request(app).post("/events").send(largeEvent);

      expect(response.status).toBe(200);
      expect(response.body.acknowledged).toBe(true);
    });
  });

  describe("PUT /events/:id", () => {
    // CM006: Update Event Information
    it("should update event title", async () => {
      const updatedEvent = {
        ...mockEvent,
        title: "Yearly Meeting",
      };

      mockCollection.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      const response = await request(app)
        .put(`/events/${mockEvent._id}`)
        .send(updatedEvent);

      expect(response.status).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
    });

    // CM010: Update Non-existent Event
    it("should return 404 when updating non-existent event", async () => {
      mockCollection.updateOne.mockResolvedValue({ matchedCount: 0 });

      const response = await request(app)
        .put(`/events/nonexistentid`)
        .send(mockEvent);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Event not found" });
    });
  });

  describe("DELETE /events/:id", () => {
    // CM004: Delete Event (Positive)
    it("should delete existing event", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const response = await request(app).delete(`/events/${mockEvent._id}`);

      expect(response.status).toBe(200);
      expect(response.body.deletedCount).toBe(1);
    });

    // CM011: Delete Non-existent Event
    it("should return 404 when deleting non-existent event", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const response = await request(app).delete(`/events/nonexistentid`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Event not found" });
    });
  });

  describe("GET /events/range", () => {
    // CM008: View Date Range Events
    it("should return events within date range", async () => {
      const rangeEvents = [mockEvent];
      mockCollection.toArray.mockResolvedValue(rangeEvents);

      const response = await request(app).get("/events/range").query({
        start: "2024-12-01",
        end: "2024-12-31",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(rangeEvents);
    });

    it("should handle empty date range", async () => {
      mockCollection.toArray.mockResolvedValue([]);

      const response = await request(app).get("/events/range").query({
        start: "2024-12-01",
        end: "2024-12-31",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /events/participant/:email", () => {
    // CM009: View Participant Events
    it("should return events for specific participant", async () => {
      const participantEvents = [mockEvent];
      mockCollection.toArray.mockResolvedValue(participantEvents);

      const response = await request(app).get(
        "/events/participant/test@example.com"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(participantEvents);
    });

    it("should return empty array when participant has no events", async () => {
      mockCollection.toArray.mockResolvedValue([]);

      const response = await request(app).get(
        "/events/participant/noevents@example.com"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  // CM013: Authentication Tests
  describe("Authentication", () => {
    it("should handle unauthorized access", async () => {
      // Temporarily override auth mock to simulate failure
      vi.mock("../middleware/auth.js", () => ({
        verifyToken: (req, res, next) =>
          res.status(401).json({ error: "Unauthorized" }),
      }));

      const response = await request(app).get("/events");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Unauthorized" });

      // Reset auth mock
      vi.mock("../middleware/auth.js", () => ({
        verifyToken: (req, res, next) => next(),
      }));
    });
  });
});
