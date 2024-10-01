// Login Page
// Path: client/src/pages/signup/index.jsx
// Author: Gigi Vu

import { Container, Paper, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SignUp from "../../components/signup"; // Import SignUpForm component
import logo from "../../assets/images/logo.png"; // Import your logo
import { createUser as apiCreateUser } from "../../api.js"; // Import API call

export default function SignUpPage() {
  const navigate = useNavigate();

  async function handleSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    try {
      let response = await apiCreateUser(values);
      if (response.status !== 200) {
        alert("User account could not be created");
      } else {
        alert("Your account is created. Please login to continue.");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <img
            src={logo}
            alt="Planzo Logo"
            style={{ width: "300px", marginBottom: "10px" }}
          />
          <Typography component="h1" variant="h5" sx={{ marginBottom: 3 }}>
            Create User Account
          </Typography>

          {/* Pass handleSubmit to SignUpForm */}
          <SignUp handleSubmit={handleSubmit} />
        </Box>
      </Paper>
    </Container>
  );
}
