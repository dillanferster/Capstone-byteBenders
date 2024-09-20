import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("User");
    navigate("/");
  };

  return (
    <div>
      <h1>Homepage</h1>
      <Button variant="contained" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
};

export default HomePage;
