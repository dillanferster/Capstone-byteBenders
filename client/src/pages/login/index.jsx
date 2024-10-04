// Login Page
// Path: client/src/pages/login/index.jsx
// Author: Gigi Vu

import Login from "../../components/login/index.jsx";
import { Box, Container, Paper, Typography } from "@mui/material";
import { verifyUser } from "../../api.js";
import axios from "axios";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  async function handleSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    try {
      let tokenValue = await verifyUser(values);
      console.log("Token received from backend:", tokenValue); // Gigi Debug log for token authentication -> remove before production
      if (tokenValue) {
        sessionStorage.setItem("User", tokenValue);
        axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`; // Bearer = authentication token formatting
        navigate("/home");
      } else {
        alert("Login failed. Please try again or contact admin");
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
            style={{ width: "300px", marginBottom: "20px" }}
          />
          <Typography component="h1" variant="h5" sx={{ marginBottom: 3 }}>
            Sign In
          </Typography>
          <Login handleSubmit={handleSubmit} />
        </Box>
      </Paper>
    </Container>
  );
}
