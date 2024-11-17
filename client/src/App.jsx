// App.jsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import Layout from "./components/layout";
import HomePage from "./pages/home";
import ProjectPage from "./pages/project";
import TaskPage from "./pages/task";
import LoginPage from "./pages/login/index.jsx";
import SignUpPage from "./pages/signup/index.jsx";
import NotePage from "./pages/note/notePage.jsx";
import CalendarPage from "./pages/calendar";
import DocumentationPage from "./pages/documentation";
import CreateUserPage from "./pages/create-user/index.jsx";
import EmailPage from "./pages/outlook/index.jsx";
// import DashboardPage from "./pages/home/index.jsx";
import { nanoid } from "nanoid";
import EmailAnalysisForm from "./pages/emailanalysis/index.jsx";

// Database functions from the API file
import { getProjects, createProject } from "./api.js";
import { SocketProvider } from "./contexts/SocketContext";
import NotificationListener from "./components/NotificationListener";

const sidenavWidth = 240; // Set the sidebar width globally

const App = () => {
  //// AUTHENTICATION TOKEN ////
  // Function to set the Authorization header with the token
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"]; // Remove auth header if token doesn't exist
    }
  };

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
          setAuthHeader(token);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        sessionStorage.removeItem("User"); // Remove invalid token
      }
    }
  }, []);

  // THEME SETUP //
  const [theme, colorMode] = useMode([]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SocketProvider>
          <NotificationListener />
          <main className="content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* <Route path="/signup" element={<SignUpPage />} /> */}
            <Route element={<Layout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/project" element={<ProjectPage />} />
              <Route path="/task" element={<TaskPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/note" element={<NotePage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/create-user" element={<CreateUserPage />} />
              <Route path="/emailanalysis" element={<EmailAnalysisForm />} />
              <Route path="/email-inbox" element={<EmailPage />} />
              </Route>
            </Routes>
          </main>
        </SocketProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
