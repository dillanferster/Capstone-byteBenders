import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import noteRoutes from "../noteRoutes.js";

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/", noteRoutes);

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

describe("Note Routes", () => {
  const mockNote = {
    _id: "507f1f77bcf86cd799439011",
    noteTitle: "Test Note",
    noteContent: "This is a test note content",
    createdBy: "testuser@example.com",
    dateCreated: "2024-01-01T00:00:00.000Z",
    dateUpdated: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default successful responses
    mockCollection.find.mockReturnThis();
    mockCollection.toArray.mockResolvedValue([mockNote]);
    mockCollection.findOne.mockResolvedValue(mockNote);
    mockCollection.insertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: mockNote._id,
    });
    mockCollection.updateOne.mockResolvedValue({
      matchedCount: 1,
      modifiedCount: 1,
    });
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });
  });

  describe("GET /notes", () => {
    it("should return all notes", async () => {
      const response = await request(app).get("/notes").timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockNote]);
      expect(mockDb.collection).toHaveBeenCalledWith("notes");
    });

    it("should return 404 when no notes exist", async () => {
      mockCollection.toArray.mockResolvedValueOnce([]);

      const response = await request(app).get("/notes").timeout(10000);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "No notes found" });
    });
  });

  describe("POST /notes", () => {
    it("Test id: NM001-P, should create new note", async () => {
      const newNote = {
        title: mockNote.noteTitle,
        content: mockNote.noteContent,
        createdBy: mockNote.createdBy,
        dateCreated: mockNote.dateCreated,
        updatedAt: mockNote.dateUpdated,
      };

      const response = await request(app)
        .post("/notes")
        .send(newNote)
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body.acknowledged).toBe(true);
      expect(response.body.insertedId).toBe(mockNote._id);
    });

    it("Test id: NM001-N, should reject empty note", async () => {
      const emptyNote = {
        title: "",
        content: "",
        createdBy: mockNote.createdBy,
        dateCreated: mockNote.dateCreated,
        updatedAt: mockNote.dateUpdated
      };

      const response = await request(app)
        .post("/notes")
        .send(emptyNote)
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ 
        error: "Note title and content cannot be empty" 
      });
    });

    it("Test id: NM001-E, should reject note with content exceeding maximum length", async () => {
      const longNote = {
        title: "Test Title",
        content: "a".repeat(10001), // Create a string that exceeds 10000 characters
        createdBy: mockNote.createdBy,
        dateCreated: mockNote.dateCreated,
        updatedAt: mockNote.dateUpdated,
      };

      const response = await request(app)
        .post("/notes")
        .send(longNote)
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Note content cannot exceed 10000 characters",
      });
    });
  });

  describe("PUT /notes/:id", () => {
    it("should update existing note", async () => {
      const updatedNote = { ...mockNote, noteTitle: "Updated Title" };
      mockCollection.findOne.mockResolvedValueOnce(updatedNote);

      const response = await request(app)
        .put(`/notes/${mockNote._id}`)
        .send(updatedNote)
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedNote);
    });

    it("should return 404 when note not found", async () => {
      mockCollection.updateOne.mockResolvedValueOnce({ modifiedCount: 0 });

      const response = await request(app)
        .put(`/notes/${mockNote._id}`)
        .send(mockNote)
        .timeout(10000);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Note not found or no changes made",
      });
    });
  });

  describe("DELETE /notes/:id", () => {
    it("Test id: NM003-P,should delete existing note", async () => {
      const response = await request(app)
        .delete(`/notes/${mockNote._id}`)
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Note deleted successfully" });
    });

    it("should return 404 when note not found", async () => {
      mockCollection.deleteOne.mockResolvedValueOnce({ deletedCount: 0 });

      const response = await request(app)
        .delete(`/notes/${mockNote._id}`)
        .timeout(10000);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Note not found" });
    });
  });
});
