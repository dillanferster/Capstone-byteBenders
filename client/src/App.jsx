import { useState, useEffect } from "react";
import axios from "axios";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";



// database functions from api file
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "./api.js";

// styles , components, material UI
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import Layout from "./components/layout";

//pages
import HomePage from "./pages/home";
import ProjectPage from "./pages/project";
import TaskPage from "./pages/task";
import LoginPage from "./pages/login/index.jsx";
import SignUpPage from "./pages/signup/index.jsx";

function App() {
  //// AUTHENTICATION TOKEN ////
  // set up a default authorization header for Axios requests
  // using a token stored in sessionStorage
  useEffect(() => {
    let token = sessionStorage.getItem("User");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Bearer = authentication token formatting
    }
  }, []);
  //// AUTHENTICATION TOKEN ////

  //// DATABASE ////
  const [projects, setProjects] = useState();

  // When app component renders loadAllProjects() is called asynchronously
  // so the rest on the program can still run when the function logic is being excutied and returned some time in future
  // if data is returned , then setProjects state is updated with data
  useEffect(() => {
    async function loadAllProjects() {
      const data = await getProjects();
      if (data) {
        setProjects(data);
      }
    }

    loadAllProjects();
  }, []);
  /////DATABASE///

  // Create a theme instance, material UI theme that can be passed into the themeprovider to set a defualt styles across app and children
  const theme = createTheme();

  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                minHeight: "100vh", // Makes the box take up full viewport height
                display: "flex", // Flexbox for layout
                flexDirection: "column", // Stack elements vertically
                justifyContent: "center", // Centers content vertically
                alignItems: "center", // Centers content horizontally
                backgroundColor: "#f5f5f5", // Example background color to visually separate the section
              }}
            >
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route element={<Layout />}>
                  <Route path="/home" element={<HomePage />} />
                  <Route
                    path="/project"
                    element={<ProjectPage></ProjectPage>}
                  />
                  <Route path="/task" element={<TaskPage />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
