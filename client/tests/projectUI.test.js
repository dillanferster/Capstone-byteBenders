import { it, expect, describe } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectForm from "../components/ProjectForm"; // Adjust path as needed
import ProjectManagement from "../components/ProjectManagement"; // Adjust path as needed

describe("Project UI Tests", () => {
  // Test Group for Add Project Button (ADPJ07-P)
  describe("Add Project Button Functionality", () => {
    it("Test ID: ADPJ07-P - Add Project button should open input menu", () => {
      // Render the project management component
      render(<ProjectManagement />);

      // Find the add project button
      const addButton = screen.getByText("Add Project");

      // Initial state - input menu should be hidden
      expect(screen.queryByTestId("project-form")).not.toBeVisible();

      // Click add button
      fireEvent.click(addButton);

      // Input menu should now be visible
      expect(screen.getByTestId("project-form")).toBeVisible();

      // Check if all required form fields are present
      expect(screen.getByLabelText("Project Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Project Description")).toBeInTheDocument();
      expect(screen.getByLabelText("Case ID")).toBeInTheDocument();
      expect(screen.getByLabelText("Data Classification")).toBeInTheDocument();
      expect(screen.getByLabelText("Assigned To")).toBeInTheDocument();
      expect(screen.getByLabelText("Project Status")).toBeInTheDocument();
    });
  });

  // Test Group for Project Selection (ADPJ08-P)
  describe("Project Selection Functionality", () => {
    const mockProject = {
      projectName: "Test Project",
      projectDesc: "Test Description",
      caseId: "123",
      dataClassification: "Confidential",
      assignedTo: "Desmond",
      projectStatus: "In Progress",
      quickBaseLink: "4444",
      dateCreated: "2024-01-01",
    };

    beforeEach(() => {
      render(<ProjectManagement initialProjects={[mockProject]} />);
    });

    it("Test ID: ADPJ08-P - Project selection should update UI state", () => {
      // Find and click the project in the table
      const projectElement = screen.getByText("Test Project");
      fireEvent.click(projectElement);

      // Check if the project row is highlighted/selected
      const projectRow = projectElement.closest("tr");
      expect(projectRow).toHaveClass("selected");

      // Check if action buttons appear
      expect(screen.getByText("Edit")).toBeVisible();
      expect(screen.getByText("Delete")).toBeVisible();
      expect(screen.getByText("View")).toBeVisible();

      // Check if project details are displayed correctly
      expect(screen.getByText("Test Description")).toBeInTheDocument();
      expect(screen.getByText("Desmond")).toBeInTheDocument();
      expect(screen.getByText("In Progress")).toBeInTheDocument();
    });

    it("Test ID: ADPJ08-P - Should deselect project when clicking elsewhere", () => {
      // First select the project
      const projectElement = screen.getByText("Test Project");
      fireEvent.click(projectElement);

      // Initial check - buttons should be visible
      expect(screen.getByText("Edit")).toBeVisible();

      // Click outside the project row (on the body)
      fireEvent.click(document.body);

      // Buttons should no longer be visible
      expect(screen.queryByText("Edit")).not.toBeVisible();
      expect(screen.queryByText("Delete")).not.toBeVisible();
      expect(screen.queryByText("View")).not.toBeVisible();
    });

    it("Test ID: ADPJ08-P - Should update selected project when clicking different project", () => {
      // Add another mock project
      const anotherMockProject = {
        ...mockProject,
        projectName: "Second Project",
        projectDesc: "Another Description",
      };

      // Re-render with both projects
      render(
        <ProjectManagement
          initialProjects={[mockProject, anotherMockProject]}
        />
      );

      // Select first project
      fireEvent.click(screen.getByText("Test Project"));

      // Check first project is selected
      expect(screen.getByText("Test Description")).toBeInTheDocument();

      // Select second project
      fireEvent.click(screen.getByText("Second Project"));

      // Check second project is now selected
      expect(screen.getByText("Another Description")).toBeInTheDocument();
    });
  });
});
