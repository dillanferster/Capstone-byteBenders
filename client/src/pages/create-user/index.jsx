// Author: Gigi Vu

import { Container, Paper, Box, Typography } from "@mui/material";
import SignUp from "../../components/signup"; // Import SignUpForm component
import logo from "../../assets/images/logo.png"; // Import your logo
import { createUser as apiCreateUser } from "../../api.js"; // Import API call
import Header from "../../components/Header";

export default function CreateUserPage() {
  async function handleSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    try {
      let response = await apiCreateUser(values);
      if (response.status !== 200) {
        alert("User account could not be created");
      } else {
        alert("Account created for user " + values.email + "!");
      }
    } catch (error) {
      console.log(error);
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
