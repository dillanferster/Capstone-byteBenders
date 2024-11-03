import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import projectRoutes from "../projectRoutes.js";

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/", projectRoutes);

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

// Mock AWS SDK - Fixed version
vi.mock("aws-sdk", () => {
  const mockComprehend = {
    batchDetectEntities: vi.fn().mockReturnValue({
      promise: vi.fn().mockResolvedValue({
        ResultList: [
          {
            Entities: [
              { Type: "PERSON", Text: "John Doe" },
              { Type: "TITLE", Text: "Website Redesign" },
              { Type: "DATE", Text: "2024-01-01" },
            ],
          },
        ],
      }),
    }),
  };

  return {
    default: { Comprehend: vi.fn(() => mockComprehend) },
    Comprehend: vi.fn(() => mockComprehend),
  };
});

describe("Project Routes", () => {
  const mockProject = {
    _id: "507f1f77bcf86cd799439011",
    projectName: "Test Project",
    projectDesc: "Test Description",
    caseId: "CASE123",
    dataClassification: "Confidential",
    assignedTo: "John Doe",
    projectStatus: "In Progress",
    quickBaseLink: "https://quickbase.com/123",
    dateCreated: "2024-01-01T00:00:00.000Z",
    TaskIdForProject: ["task1", "task2"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default successful responses
    mockCollection.find.mockReturnThis();
    mockCollection.toArray.mockResolvedValue([mockProject]);
    mockCollection.findOne.mockResolvedValue(mockProject);
    mockCollection.insertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: mockProject._id,
    });
    mockCollection.updateOne.mockResolvedValue({
      matchedCount: 1,
      modifiedCount: 1,
    });
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });
  });

  describe("POST /projects", () => {
    it("Test id: ADPJ01-P, should create new project with valid data", async () => {
      const newProject = {
        projectName: "test project",
        projectDesc: "testing add",
        caseId: "123",
        dataClassification: "data",
        assignedTo: "Desmond",
        projectStatus: "started",
        quickBaseLink: "4444",
        dateCreated: new Date().toISOString(),
      };

      // Mock findOne to return null (no existing project)
      mockCollection.findOne.mockResolvedValueOnce(null);

      const response = await request(app)
        .post("/projects")
        .send(newProject)
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body.acknowledged).toBe(true);
    });

    it("Test id: ADPJ02-N, should reject project with empty name", async () => {
      const newProject = {
        projectName: "",
        projectDesc: "testing add",
        caseId: "123",
        dataClassification: "data",
        assignedTo: "Desmond",
        projectStatus: "started",
        quickBaseLink: "4444",
        dateCreated: new Date().toISOString(),
      };

      const response = await request(app)
        .post("/projects")
        .send(newProject)
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Enter valid project name");
    });

    it("Test id: ADPJ03-N, should reject project with duplicate name", async () => {
      const newProject = {
        projectName: "existing project",
        projectDesc: "testing add",
        caseId: "123",
        dataClassification: "data",
        assignedTo: "Desmond",
        projectStatus: "started",
        quickBaseLink: "4444",
        dateCreated: new Date().toISOString(),
      };

      // Mock findOne to return an existing project
      mockCollection.findOne.mockResolvedValueOnce({
        projectName: "existing project",
      });

      const response = await request(app)
        .post("/projects")
        .send(newProject)
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Project name already exists");
    });

    it("Test id: ADPJ04-N, should reject project name with special characters", async () => {
      const newProject = {
        projectName: "!Project",
        projectDesc: "testing add",
        caseId: "123",
        dataClassification: "data",
        assignedTo: "Desmond",
        projectStatus: "started",
        quickBaseLink: "4444",
        dateCreated: new Date().toISOString(),
      };

      const response = await request(app)
        .post("/projects")
        .send(newProject)
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Name must only be letters");
    });

    it("Test id: ADPJ05-N, should reject project with name exceeding maximum length", async () => {
      const newProject = {
        projectName:
          "looooooooooooooonnnggggggggggggggggggg naaaaaaaaaaammmmmeeeeeeeeeeeeeeeeee prooooojeeeeeeeecccccccccccct",
        projectDesc: "testing add",
        caseId: "123",
        dataClassification: "data",
        assignedTo: "Desmond",
        projectStatus: "started",
        quickBaseLink: "4444",
        dateCreated: new Date().toISOString(),
      };

      const response = await request(app)
        .post("/projects")
        .send(newProject)
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Name must be at max 20 characters");
    });

    it("Test id: ADPJ06-N, should reject project with past date", async () => {
      const newProject = {
        projectName: "valid project",
        projectDesc: "testing add",
        caseId: "123",
        dataClassification: "data",
        assignedTo: "Desmond",
        projectStatus: "started",
        quickBaseLink: "4444",
        dateCreated: "1809-10-07T00:00:00.000Z",
      };

      const response = await request(app)
        .post("/projects")
        .send(newProject)
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Start date cannot be in the past");
    });
  });

  describe("GET /projects", () => {
    it("should return all projects", async () => {
      const response = await request(app).get("/projects").timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockProject]);
      expect(mockDb.collection).toHaveBeenCalledWith("Frank");
    });
  });

  describe("GET /projects/:id", () => {
    it("should return single project by id", async () => {
      const response = await request(app)
        .get(`/projects/${mockProject._id}`)
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProject);
    });

    it("should handle project not found", async () => {
      mockCollection.findOne.mockResolvedValueOnce(null);

      await expect(
        request(app).get(`/projects/${mockProject._id}`).timeout(10000)
      ).rejects.toThrow("data was not found");
    });
  });

  describe("POST /projects", () => {
    it("should create new project", async () => {
      const newProject = { ...mockProject };
      delete newProject._id;

      const response = await request(app)
        .post("/projects")
        .send(newProject)
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body.acknowledged).toBe(true);
      expect(response.body.insertedId).toBe(mockProject._id);
    });
  });

  describe("PUT /projects/:id", () => {
    it("should update existing project", async () => {
      const response = await request(app)
        .put(`/projects/${mockProject._id}`)
        .send(mockProject)
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
    });
  });

  describe("PUT /projectsupdate/:id", () => {
    it("should add task ID to project's TaskIdForProject array", async () => {
      const taskId = "newTask123";

      const response = await request(app)
        .put(`/projectsupdate/${mockProject._id}`)
        .send({ taskId })
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: expect.any(Object) },
        { $push: { TaskIdForProject: taskId } }
      );
    });
  });

  describe("DELETE /projectstaskdelete/:id", () => {
    it("should remove task ID from project's TaskIdForProject array", async () => {
      const taskId = "task1";

      const response = await request(app)
        .delete(`/projectstaskdelete/${mockProject._id}`)
        .send({ taskId })
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: expect.any(Object) },
        { $pull: { TaskIdForProject: taskId } }
      );
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should delete existing project", async () => {
      const response = await request(app)
        .delete(`/projects/${mockProject._id}`)
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body.deletedCount).toBe(1);
    });
  });

  describe("POST /analyze-email", () => {
    it("should analyze email text and return project fields", async () => {
      const emailText =
        "John Doe will work on Website Redesign starting 2024-01-01";

      const response = await request(app)
        .post("/analyze-email")
        .send({ emailText })
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project).toMatchObject({
        assignedTo: "John Doe",
        projectName: "Website Redesign",
        startDate: "2024-01-01",
      });
    });

    it("should handle empty email text", async () => {
      const response = await request(app)
        .post("/analyze-email")
        .send({ emailText: "" })
        .timeout(10000);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Email content cannot be empty");
    });
  });
});
