import { verifyUser } from "../../api.js";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Box, Container, Paper } from "@mui/material";
import axios from "axios";
import logo from "../../assets/images/logo.png";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let tokenValue = await verifyUser(user);
      console.log("Token received from backend:", tokenValue); // Gigi Debug log for token authentication -> remove before production
      if (tokenValue) {
        sessionStorage.setItem("User", tokenValue);
        axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`; // Bearer = authentication token formatting
        navigate("/home");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
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
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              autoComplete="current-password"
              type="password"
              onChange={handleChange}
              variant="outlined"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 3, marginBottom: 2 }}
            >
              Login
            </Button>
          </form>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Don't have an account?{" "}
            <Button variant="text" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
