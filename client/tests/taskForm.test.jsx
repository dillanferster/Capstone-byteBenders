import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import TaskEditMenu from "../src/components/taskeditmenu";

describe("TaskEditMenu Input Validation", () => {
  const defaultProps = {
    isOpen: true,
    toggleForm: vi.fn(),
    setIsOpen: vi.fn(),
    selectedTask: [],
    updateTask: vi.fn(),
    createTask: vi.fn(),
    viewClicked: false,
    setViewClicked: vi.fn(),
    addClicked: true,
    setAddClicked: vi.fn(),
    editClicked: false,
    setEditClicked: vi.fn(),
    reloadTheGrid: vi.fn(),
    projects: [
      { _id: "1", projectName: "Test Project 1" },
      { _id: "2", projectName: "Test Project 2" },
    ],
    addTaskToProject: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (props = {}) => {
    return render(<TaskEditMenu {...defaultProps} {...props} />);
  };

  // Empty Form Validation
  describe("Empty Form Validation", () => {
    it("should show error when submitting empty form", async () => {
      renderForm();

      // Click submit without entering any data
      fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByTestId("taskName-Error")).toBeInTheDocument();
        expect(screen.getByTestId("taskProject-Error")).toBeInTheDocument();
        expect(screen.getByTestId("projectStatus-Error")).toBeInTheDocument();
        expect(screen.getByTestId("taskAssignedTo-Error")).toBeInTheDocument();
        expect(screen.getByTestId("taskPriority-Error")).toBeInTheDocument();
        expect(screen.getByTestId("taskCategory-Error")).toBeInTheDocument();
        expect(screen.getByTestId("taskStartDate-Error")).toBeInTheDocument();
        expect(screen.getByTestId("taskDueDate-Error")).toBeInTheDocument();
        expect(screen.getByTestId("taskChronicles-Error")).toBeInTheDocument();
        expect(
          screen.getByTestId("taskChroniclesComplete-Error")
        ).toBeInTheDocument();
        expect(screen.getByTestId("taskDescription-Error")).toBeInTheDocument();
        expect(screen.getByTestId("taskAttachments-Error")).toBeInTheDocument();
      });
    });
  });

  // Valid Form Submission
  describe("Valid Form Submission", () => {
    it("should not show errors when submitting valid data", async () => {
      renderForm();

      // Fill in required fields
      await userEvent.type(screen.getByTestId("taskName"), "Test Task");
      await userEvent.selectOptions(
        screen.getByTestId("taskProject"),
        "Test Project 1"
      );
      await userEvent.selectOptions(
        screen.getByTestId("projectStatus"),
        "In Progress"
      );
      await userEvent.type(screen.getByTestId("taskAssignedTo"), "Test User");

      await userEvent.selectOptions(screen.getByTestId("taskPriority"), "High");
      await userEvent.type(screen.getByTestId("taskCategory"), "Bug");
      await userEvent.type(screen.getByTestId("taskStartDate"), "2024-01-01");
      await userEvent.type(screen.getByTestId("taskDueDate"), "2024-01-01");
      await userEvent.type(
        screen.getByTestId("taskChronicles"),
        "Test Chronicles"
      );
      await userEvent.type(screen.getByTestId("taskChroniclesComplete"), "100");
      await userEvent.type(
        screen.getByTestId("taskDescription"),
        "Test Description"
      );

      // Submit form
      fireEvent.click(screen.getByText("Add Task"));

      // Verify no error messages are shown
      await waitFor(() => {
        expect(screen.queryByTestId("taskName-Error")).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskProject-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("projectStatus-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskAssignedTo-Error")
        ).not.toBeInTheDocument();

        expect(
          screen.queryByTestId("taskPriority-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskCategory-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskStartDate-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskDueDate-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskChronicles-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskChroniclesComplete-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskDescription-Error")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("taskAttachments-Error")
        ).not.toBeInTheDocument();
      });
    });
  });

  // Invalid Form Submission
  describe("Invalid Form Submission", () => {
    it("should show error for invalid task name (special characters)", async () => {
      renderForm();

      // Enter invalid task name with special characters
      await userEvent.type(screen.getByTestId("taskName"), "^(&^*&");

      // Submit form
      fireEvent.click(screen.getByText("Add Task"));

      // Verify error message
      await waitFor(() => {
        expect(screen.queryByTestId("taskName-Error")).toBeInTheDocument();
      });
    });

    it("should show error for invalid assigned to (special characters)", async () => {
      renderForm();

      await userEvent.type(screen.getByTestId("taskAssignedTo"), "@#$%^&*");

      fireEvent.click(screen.getByText("Add Task"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("taskAssignedTo-Error")
        ).toBeInTheDocument();
      });
    });

    it("should show error for invalid category (special characters)", async () => {
      renderForm();

      await userEvent.type(screen.getByTestId("taskCategory"), "!@#$%^&");

      fireEvent.click(screen.getByText("Add Task"));

      await waitFor(() => {
        expect(screen.queryByTestId("taskCategory-Error")).toBeInTheDocument();
      });
    });

    it("should show error for invalid description (special characters)", async () => {
      renderForm();

      await userEvent.type(screen.getByTestId("taskDescription"), "!@#$%^&*()");

      fireEvent.click(screen.getByText("Add Task"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("taskDescription-Error")
        ).toBeInTheDocument();
      });
    });

    it("should show error for invalid chronicles (special characters)", async () => {
      renderForm();

      await userEvent.type(screen.getByTestId("taskChronicles"), "@#$%^&*");

      fireEvent.click(screen.getByText("Add Task"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("taskChronicles-Error")
        ).toBeInTheDocument();
      });
    });

    it("should show error for invalid chronicles complete (special characters)", async () => {
      renderForm();

      await userEvent.type(
        screen.getByTestId("taskChroniclesComplete"),
        "!@#$%^&"
      );

      fireEvent.click(screen.getByText("Add Task"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("taskChroniclesComplete-Error")
        ).toBeInTheDocument();
      });
    });
  });
});
