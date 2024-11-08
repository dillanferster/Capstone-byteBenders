import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Login from "../src/components/login";

describe("Login Component", () => {
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = (props = {}) => {
    return render(<Login handleSubmit={mockHandleSubmit} {...props} />);
  };

  // Email Validation Tests
  describe("Email Validation", () => {
    it("UA001-P1: should accept valid email format", async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
      });
    });

    it("UA001-N1: should reject invalid email format", async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), "invalidemail");
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Invalid email. (example@example.com)")
        ).toBeInTheDocument();
      });
    });

    it("UA001-E1: should handle email with special characters", async () => {
      renderLogin();
      await userEvent.type(
        screen.getByLabelText(/email/i),
        "test+special@example.co.uk"
      );
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
      });
    });
  });

  // Password Validation Tests
  describe("Password Validation", () => {
    it("UA002-P1: should accept valid password", async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/password/i), "ValidPass123");
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(
          screen.queryByText("Password must contain")
        ).not.toBeInTheDocument();
      });
    });

    it("UA002-N1: should reject password without numbers", async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/password/i), "OnlyLetters");
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Password must contain letters and numbers")
        ).toBeInTheDocument();
      });
    });

    it("UA002-E1: should handle password with maximum allowed length", async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/password/i), "A1".repeat(50)); // 100 characters
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(
          screen.queryByText("Password must contain")
        ).not.toBeInTheDocument();
      });
    });
  });

  // Form Submission Tests
  describe("Form Submission", () => {
    it("UA003-P1: should submit form with valid credentials", async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "ValidPass123");
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it("UA003-N1: should prevent submission with empty fields", async () => {
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
        expect(mockHandleSubmit).not.toHaveBeenCalled();
      });
    });

    it("UA003-E1: should handle rapid multiple form submissions", async () => {
      renderLogin();
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "ValidPass123");

      // Attempt multiple rapid submissions
      fireEvent.click(screen.getByRole("button", { name: /login/i }));
      fireEvent.click(screen.getByRole("button", { name: /login/i }));
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      });
    });
  });

  // Password Visibility Tests
  describe("Password Visibility Toggle", () => {
    it("UA004-P1: should toggle password visibility successfully", async () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);
      const visibilityToggle = screen.getByRole("button", {
        name: /toggle password visibility/i,
      });

      expect(passwordInput).toHaveAttribute("type", "password");
      await userEvent.click(visibilityToggle);
      expect(passwordInput).toHaveAttribute("type", "text");
    });

    it("UA004-N1: should handle multiple rapid toggle clicks", async () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);
      const visibilityToggle = screen.getByRole("button", {
        name: /toggle password visibility/i,
      });

      await userEvent.dblClick(visibilityToggle);
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("UA004-E1: should maintain visibility state with special characters", async () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);
      const visibilityToggle = screen.getByRole("button", {
        name: /toggle password visibility/i,
      });

      await userEvent.type(passwordInput, "!@#$%^&*()_+");
      await userEvent.click(visibilityToggle);
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(passwordInput).toHaveValue("!@#$%^&*()_+");
    });
  });
});
