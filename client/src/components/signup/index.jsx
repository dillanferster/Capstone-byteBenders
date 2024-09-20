import { createUser as apiCreateUser } from "../../api.js";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function SignUp() {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // Check if any field is empty
    if (!user.fname || !user.lname || !user.email || !user.password) {
      alert("All fields are required");
      return;
    }
    try {
      let response = await apiCreateUser(user);
      if (response.status !== 200) {
        alert("User account could not be created");
      } else {
        alert("Your account is created. Please login to continue.");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
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
            style={{ width: "300px", marginBottom: "10px" }}
          />
          <Typography component="h1" variant="h5" sx={{ marginBottom: 3 }}>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              margin="normal"
              fullWidth
              label="First Name"
              name="fname"
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Last Name"
              name="lname"
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
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
              Create Account
            </Button>
            <Button variant="text" onClick={() => navigate("/")}>
              Back to Login
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}
