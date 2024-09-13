import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// database functions from api file
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "./api.js";

// styles , material UI
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import SideNavbar from "./components/sidenav";

//pages
import HomePage from "./pages/home";
import ProjectPage from "./pages/project";
import TaskPage from "./pages/task";

function App() {
  //// DATABASE ////
  const [projects, setProjects] = useState();

  function makeProject() {
    let projectObject = {
      projectName: "first",
      projectDesc: "yes",
      assignedTo: "dillan",
      dateCreated: new Date(),
    };

    createProject(projectObject);
  }

  async function loadAllProjects() {
    const data = await getProjects();
    if (data) {
      setProjects(data);
    }
  }

  useEffect(() => {}, []);
  /////DATABASE///

  // Create a theme instance, material UI theme that can be passed into the themeprovider to set a defualt styles across app and children
  const theme = createTheme();

  // navbar items array
  const menuItems = [
    { text: "Home", icon: "HomeIcon", path: "/" },
    { text: "Projects", icon: "FolderIcon", path: "/project" },
    { text: "Tasks", icon: "AssignmentIcon", path: "/task" },
  ];

  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <SideNavbar menuItems={menuItems} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage data={projects} loadProjects={loadAllProjects} />
                  }
                />
                <Route
                  path="/project"
                  element={<ProjectPage makeProject={makeProject} />}
                />
                <Route path="/task" element={<TaskPage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
