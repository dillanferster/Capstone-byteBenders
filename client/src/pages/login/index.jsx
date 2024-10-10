// Login Page
// Path: client/src/pages/login/index.jsx
// Author: Gigi Vu

import Login from "../../components/login/index.jsx";
import { Box, Container, Paper, Typography } from "@mui/material";
import { verifyUser } from "../../api.js";
import axios from "axios";
import logomini from "../../assets/images/logomini.png";
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
            src={logomini}
            alt="Planzo Logo"
            style={{ width: "200px", height: "200px", marginBottom: "20px" }}
          />
          <Typography component="h1" variant="h2" sx={{ marginBottom: 4 }}>
            Sign In
          </Typography>
          <Login handleSubmit={handleSubmit} />
          <Typography variant="body2" sx={{ marginTop: 3 }}>
            @Planzo 2024. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
