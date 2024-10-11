// Author: Gigi Vu

import { Container, Paper, Box, Typography } from "@mui/material";
import SignUp from "../../components/signup"; // Import SignUpForm component
import logo from "../../assets/images/logo.png"; // Import your logo
import { createUser as apiCreateUser } from "../../api.js"; // Import API call
import Header from "../../components/Header";

export default function CreateUserPage() {
  async function handleSubmit(values, { setSubmitting }) {
    const token = sessionStorage.getItem("User");
    if (!token) {
      alert("No token found, please log in.");
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      let response = await apiCreateUser(values);
      if (response.status === 200) {
        alert("Account created for user " + values.email + "!");
      }
    } catch (error) {
      // Check if the error response exists and handle specific cases like 409
      if (error.response && error.response.status === 409) {
        alert("User already exists. Please register with another email.");
      } else {
        alert("Issue creating user account. Please try again later.");
      }
    }
    setSubmitting(false);
  }

  return (
    <Box m="20px" px="70px" py="30px">
      <Header title="CREATE USER" subtitle="Create a New User Account" />

      {/* Pass handleSubmit to SignUpForm */}
      <SignUp handleSubmit={handleSubmit} />
    </Box>
  );
}
