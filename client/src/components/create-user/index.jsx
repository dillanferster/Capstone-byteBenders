import { createUser as apiCreateUSer } from "../../api.js";
import { useState } from "react";
import Button from "@mui/material/Button";

export default function CreateUser() {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    // Check if any field is empty
    if (!user.fname || !user.lname || !user.email || !user.password) {
      alert("All fields are required");
      return;
    }
    try {
      let response = await apiCreateUSer(user);
      if (response.status !== 200) {
        alert("User account could not be created");
      } else {
        alert("User account created");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <form>
        <input
          onChange={handleChange}
          type="text"
          name="fname"
          placeholder={"First Name"}
          required
        />
        <input
          onChange={handleChange}
          type="text"
          name="lname"
          placeholder={"Last Name"}
          required
        />
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
          Create Account
        </Button>
      </form>
    </div>
  );
}
