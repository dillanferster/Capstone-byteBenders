import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SignUp from "../src/components/signup";

describe("SignUp Component", () => {
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignUp = (props = {}) => {
    return render(<SignUp handleSubmit={mockHandleSubmit} {...props} />);
  };

  // Name Validation Tests
  describe("Name Validation", () => {
    it("UC001-P1: should accept valid first and last names", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/first name/i), "John");
      await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByText("First name is required")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Last name is required")
        ).not.toBeInTheDocument();
      });
    });

    it("UC001-N1: should reject names with numbers or special characters", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/first name/i), "John123");
      await userEvent.type(screen.getByLabelText(/last name/i), "Doe@#");
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/only letters allowed/i)).toBeInTheDocument();
      });
    });

    it("UC001-E1: should handle names with spaces correctly", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/first name/i), "Mary Jane");
      await userEvent.type(screen.getByLabelText(/last name/i), "Van Dyke");
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/only letters allowed/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  // Email Validation Tests
  describe("Email Validation", () => {
    it("UC002-P1: should accept valid email format", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
      });
    });

    it("UC002-N1: should reject invalid email format", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/email/i), "invalidemail");
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it("UC002-E1: should handle email length limits", async () => {
      renderSignUp();
      const longEmail = "a".repeat(45) + "@example.com"; // 51 characters
      await userEvent.type(screen.getByLabelText(/email/i), longEmail);
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/must be less than 50 characters/i)
        ).toBeInTheDocument();
      });
    });
  });

  // Role Selection Tests
  describe("Role Selection", () => {
    it("UC003-P1: should default to User role", async () => {
      renderSignUp();
      const roleSelect = screen.getByLabelText(/role/i);
      expect(roleSelect).toHaveValue("User");
    });

    it("UC003-N1: should allow changing to Admin role", async () => {
      renderSignUp();
      const roleSelect = screen.getByLabelText(/role/i);
      await userEvent.selectOptions(roleSelect, "admin");
      expect(roleSelect).toHaveValue("admin");
    });

    it("UC003-E1: should require role selection", async () => {
      renderSignUp();
      const roleSelect = screen.getByLabelText(/role/i);
      fireEvent.change(roleSelect, { target: { value: "" } });
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(screen.getByText("Role is required")).toBeInTheDocument();
      });
    });
  });

  // Password Validation Tests
  describe("Password Validation", () => {
    it("UC004-P1: should accept valid password", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/password/i), "ValidPass123");
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/must contain both letters and numbers/i)
        ).not.toBeInTheDocument();
      });
    });

    it("UC004-N1: should reject password without numbers", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/password/i), "OnlyLetters");
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/must contain both letters and numbers/i)
        ).toBeInTheDocument();
      });
    });

    it("UC004-E1: should validate password special characters", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/password/i), "Valid123#$%");
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            /only use letters, numbers, or these special characters/i
          )
        ).toBeInTheDocument();
      });
    });
  });

  // Form Submission Tests
  describe("Form Submission", () => {
    it("UC005-P1: should submit form with valid data", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/first name/i), "John");
      await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
      await userEvent.type(
        screen.getByLabelText(/email/i),
        "john.doe@example.com"
      );
      await userEvent.type(screen.getByLabelText(/password/i), "ValidPass123");

      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
        expect(mockHandleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            fname: "John",
            lname: "Doe",
            email: "john.doe@example.com",
            password: "ValidPass123",
            role: "User",
          }),
          expect.anything()
        );
      });
    });

    it("UC005-N1: should prevent submission with empty fields", async () => {
      renderSignUp();
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(screen.getByText("First name is required")).toBeInTheDocument();
        expect(screen.getByText("Last name is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
        expect(mockHandleSubmit).not.toHaveBeenCalled();
      });
    });

    it("UC005-E1: should handle rapid multiple form submissions", async () => {
      renderSignUp();
      await userEvent.type(screen.getByLabelText(/first name/i), "John");
      await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
      await userEvent.type(
        screen.getByLabelText(/email/i),
        "john.doe@example.com"
      );
      await userEvent.type(screen.getByLabelText(/password/i), "ValidPass123");

      // Attempt multiple rapid submissions
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );
      fireEvent.click(
        screen.getByRole("button", { name: /create user account/i })
      );

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      });
    });
  });
});
