import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// styles , material UI
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import "./App.css";
import SideNavbar from "./assets/components/sidenav";

//pages
import HomePage from "./pages/home";
import ProjectPage from "./pages/project";
import TaskPage from "./pages/task";

function App() {
  //// DATABASE ////
  const [data, setData] = useState();
  const [showData, setShowData] = useState();

  function createProject() {
    let projectObject = {
      projectName: "new project",
      projectDesc: "the new one",
      assignedTo: "dillan",
      dateCreated: new Date(),
    };

    axios.post("http://localhost:3000/projects", projectObject);
  }

  useEffect(() => {
    async function getData() {
      const response = await axios.get("http://localhost:3000/projects");
      if (response.status === 200) {
        setData(response);
      }
    }

    getData();
  }, []);
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
                <Route path="/" element={<HomePage setShowData={setShowData} showData={showData} data={data} createProject={createProject()}/>} />
                <Route path="/project" element={<ProjectPage />} />
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
