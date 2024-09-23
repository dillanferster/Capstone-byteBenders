// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import Layout from "./components/layout";
import HomePage from "./pages/home";
import ProjectPage from "./pages/project";
import TaskPage from "./pages/task";
import LoginPage from "./pages/login/index.jsx";
import SignUpPage from "./pages/signup/index.jsx";
import NotePage from "./pages/note/notePage.jsx";
import { nanoid } from "nanoid";

// Database functions from the API file
import { getProjects, createProject } from "./api.js";

const App = () => {
  //// AUTHENTICATION TOKEN ////
  useEffect(() => {
    let token = sessionStorage.getItem("User");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  //// DATABASE ////
  const [projects, setProjects] = useState();

  const makeProject = () => {
    let projectObject = {
      projectName: "first",
      projectDesc: "yes",
      assignedTo: "dillan",
      dateCreated: new Date(),
    };

    createProject(projectObject);
  };

  const loadAllProjects = async () => {
    const data = await getProjects();
    if (data) {
      setProjects(data);
    }
  };

  useEffect(() => {
    loadAllProjects();
  }, []);

  // THEME SETUP //
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route element={<Layout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/project" element={<ProjectPage makeProject={makeProject} />} />
                <Route path="/note" element={<NotePage/>}/>
                <Route path="/task" element={<TaskPage />} />
              </Route>
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
