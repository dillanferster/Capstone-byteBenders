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

  ///// NOTES MANAGEMENT ////
  const [notes, setNotes] = useState(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem("notes"));
      return Array.isArray(storedNotes) ? storedNotes : [];
    } catch (error) {
      console.error("Error parsing notes from localStorage:", error);
      return [];
    }
  });

  const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || "");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: nanoid(),
      title: "Untitled",
      content: "",
      updatedAt: Date.now(),
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentNoteId(newNote.id);
  };

  const updateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  const getCurrentNote = () => {
    return notes.find((note) => note.id === currentNoteId) || notes[0];
  };

  const deleteNote = (noteToDeleteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteToDeleteId));
    if (noteToDeleteId === currentNoteId) {
      setCurrentNoteId(notes[0]?.id || ""); // Adjust to set to another valid note ID or empty if none left
    }
  };

  console.log("current notes", notes);
  console.log("current note id", currentNoteId);

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
                <Route
                  path="/note"
                  element={
                    <NotePage
                      notes={notes}
                      addNote={addNote}
                      currentNoteId={currentNoteId}
                      setCurrentNoteId={setCurrentNoteId}
                      updateNote={updateNote}
                      deleteNote={deleteNote}
                    />
                  }
                />
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
