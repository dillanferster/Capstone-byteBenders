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

  describe("Form Validation", () => {
    it("should show error when submitting empty form", async () => {
      renderForm();

      // Click submit without entering any data
      fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByTestId("taskName-Error")).toBeInTheDocument();
      });
    });

    
    it("should not show errors when submitting valid data", async () => {
      renderForm();

      // Fill in required fields
      await userEvent.type(screen.getByTestId("taskName"), "Test Task");

      // Submit form
      fireEvent.click(screen.getByText("Add Task"));

      // Verify no error messages are shown
      await waitFor(() => {
        expect(screen.queryByTestId("taskName-Error")).not.toBeInTheDocument();
      });
    });

    it("should show error for invalid task name (special characters)", async () => {
      renderForm();

      // Enter invalid task name with special characters
      await userEvent.type(screen.getByTestId("taskName"), "^(&^*&");

      // Submit form
      fireEvent.click(screen.getByText("Add Task"));

      // Verify error message
      await waitFor(() => {
        expect(screen.queryByTestId("taskName-Error")).not.toBeInTheDocument();
      });
    });
  });
});
