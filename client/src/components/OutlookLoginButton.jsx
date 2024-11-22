// src/components/OutlookLoginButton.jsx
import React from "react";
import { emailLogin } from "../api";
import Button from "@mui/material/Button";

// functional react component that returns a button
const LoginButton = () => {
  const handleLogin = () => {
    emailLogin();
    console.log("Login button clicked");
  };

  return (
    <Button onClick={handleLogin} variant="contained" color="warning">
      Login with Microsoft
    </Button>
  );
};

export default LoginButton;
