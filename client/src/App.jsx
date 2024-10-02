// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import Layout from "./components/layout";
import Sidebar from "./pages/global/sidebar";
import Topbar from "./pages/global/topbar";
import HomePage from "./pages/home";
import ProjectPage from "./pages/project";
import TaskPage from "./pages/task";
import LoginPage from "./pages/login/index.jsx";
import SignUpPage from "./pages/signup/index.jsx";
import NotePage from "./pages/note/notePage.jsx";
import CalendarPage from "./pages/calendar";
import DocumentationPage from "./pages/documentation";
// import DashboardPage from "./pages/home/index.jsx";
import { nanoid } from "nanoid";

// Database functions from the API file
import { getProjects, createProject } from "./api.js";

const App = () => {
  //// AUTHENTICATION TOKEN ////
  useEffect(() => {
    let token = sessionStorage.getItem("User");

    // verify token expiration status
    if (token) {
      try {
        // Decode the token and check its expiry time
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // current time in seconds

        // If the token is expired, log the user out
        if (decoded.exp < currentTime) {
          console.log("Token has expired. Logging out...");
          sessionStorage.removeItem("User");
          alert("Your session has expired. Please log in again.");
          // redirect to login page
          window.location.href = "/"; // Redirects to login page
        } else {
          // If the token is still valid, set the Axios default header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        sessionStorage.removeItem("User"); // Remove invalid token
      }
    }
  }, []);

  //// DATABASE ////
  // const [projects, setProjects] = useState();

  // When app component renders loadAllProjects() is called asynchronously
  // so the rest on the program can still run when the function logic is being excuted and returned some time in future
  // if data is returned , then setProjects state is updated with data
  // useEffect(() => {
  //   async function loadAllProjects() {
  //     try {
  //       const data = await getProjects();
  //       if (data) {
  //         setProjects(data);
  //       } else {
  //         console.log("No projects found");
  //       }
  //     } catch (error) {
  //       console.error("Error loading projects:", error);
  //     }
  //   }

  //   loadAllProjects();
  // }, []);
  /////DATABASE///

  // THEME SETUP //
  const [theme, colorMode] = useMode([]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* <Sidebar /> */}
          <main className="content">
            {/* <Topbar /> */}
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route element={<Layout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/project" element={<ProjectPage />} />
                <Route path="/note" element={<NotePage />} />
                <Route path="/task" element={<TaskPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/documentation" element={<DocumentationPage />} />
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
