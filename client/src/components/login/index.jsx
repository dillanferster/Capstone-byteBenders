import { verifyUser } from "../../api.js";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let response = await verifyUser(user);
      if (response) {
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
    <div>
      <form>
        <input
          onChange={handleChange}
          type="text"
          name="email"
          placeholder={"Email"}
          required
        />
        <input
          onChange={handleChange}
          type="password"
          name="password"
          placeholder={"Password"}
          required
        />
        <Button onClick={handleSubmit} variant="contained">
          Login
        </Button>
      </form>
    </div>
  );
}
