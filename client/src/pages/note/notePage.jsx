import React, { useState, useEffect } from "react"; // Import React and hooks
import Sidebar from "../../components/note/sidebar"; // Import Sidebar component
import NoteEditor from "../../components/note/noteEditor"; // Import NoteEditor component
import "./NotePage.css"; // Import CSS for styling
import { getNotes, getTasks, updateNote, deleteNote } from "../../api"; // Import API functions
import { ToastContainer, toast } from "react-toastify"; // Import Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import Header from "../../components/Header"; // Import Header component
import "./notePage.css";
// reference: https://www.youtube.com/watch?v=571sn_pS4kY
// reference: https://www.youtube.com/watch?v=571sn_pS4kYhttps://blog.danylkecha.com/react-notes-app?x-host=blog.danylkecha.com
// reference: Chatgpt 
const NotePage = () => {
  // State to store all notes fetched from the database
  const [notes, setNotes] = useState([]);
  // State to store filtered notes based on the selected task
  const [filteredNotes, setFilteredNotes] = useState([]);
  // State to track the currently selected note ID
  const [currentNoteId, setCurrentNoteId] = useState(null);
  // State to toggle between edit and preview modes (default: Preview mode)
  const [isEditMode, setIsEditMode] = useState(false);
  // State to store all tasks fetched for the dropdown filter
  const [tasks, setTasks] = useState([]);
  // State to track the currently selected task ID in the dropdown
  const [selectedTaskId, setSelectedTaskId] = useState("");

  // Function to fetch notes from the database
  const fetchNotes = async () => {
    try {
      const notesFromDB = await getNotes(); // Fetch notes from the API
      const updatedNotes = notesFromDB.map((note) => ({
        ...note,
        isTaskNote: Boolean(note.taskId), // Add a flag if the note is task-related
        noteTitle: note.noteTitle || note.title, // Normalize title property
        noteContent: note.noteContent || note.content, // Normalize content property
      }));
      setNotes(updatedNotes || []); // Update the notes state
      setFilteredNotes(updatedNotes || []); // Initially display all notes
    } catch (error) {
      console.error("Error fetching notes:", error); // Log error if fetching fails
      toast.error("Failed to fetch notes"); // Show error notification
    }
  };

  // Function to fetch tasks from the database for the dropdown filter
  const fetchTasks = async () => {
    try {
      const tasksFromDB = await getTasks(); // Fetch tasks from the API
      setTasks(tasksFromDB || []); // Update the tasks state
    } catch (error) {
      console.error("Error fetching tasks:", error); // Log error if fetching fails
      toast.error("Failed to fetch tasks"); // Show error notification
    }
  };

  // Fetch notes and tasks when the component is mounted
  useEffect(() => {
    fetchNotes(); // Fetch notes
    fetchTasks(); // Fetch tasks
  }, []);

  // Handle changes in the task filter dropdown
  const handleTaskFilterChange = (e) => {
    const taskId = e.target.value; // Get the selected task ID
    setSelectedTaskId(taskId); // Update the selected task ID state

    if (taskId) {
      const filtered = notes.filter((note) => note.taskId === taskId); // Filter notes by task ID
      setFilteredNotes(filtered); // Update filtered notes
    } else {
      setFilteredNotes(notes); // Show all notes if no task is selected
    }
  };

  // Handle saving updates to an existing note
  const handleSaveNote = async (noteData) => {
    if (!noteData._id) {
      console.error("Note ID is missing"); // Log error if note ID is missing
      toast.error("Cannot update note: Missing ID"); // Show error notification
      return;
    }

    try {
      const noteToUpdate = {
        noteTitle: noteData.noteTitle, // Note title
        noteContent: noteData.noteContent, // Note content
        taskId: noteData.taskId || null, // Task ID, if available
        dateUpdated: new Date().toISOString(), // Update timestamp
      };

      const updatedNote = await updateNote(noteData._id, noteToUpdate); // Update note in the database

      // Update notes state with the updated note
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteData._id
            ? {
                ...note,
                ...updatedNote,
                isTaskNote: !!updatedNote.taskId, // Update task-related flag
              }
            : note
        )
      );

      // Update filteredNotes state with the updated note
      setFilteredNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteData._id
            ? {
                ...note,
                ...updatedNote,
                isTaskNote: !!updatedNote.taskId, // Update task-related flag
              }
            : note
        )
      );

      toast.success("Note updated successfully"); // Show success notification
    } catch (error) {
      console.error("Error updating note:", error); // Log error
      toast.error("Failed to update note. Please try again."); // Show error notification
    }
  };

  // Handle deleting a note by its ID
  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId); // Delete note from the database

      // Remove the note from notes and filteredNotes state
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      setFilteredNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== noteId)
      );

      if (currentNoteId === noteId) {
        setCurrentNoteId(null); // Reset currentNoteId if the deleted note was selected
      }
      toast.success("Note deleted successfully"); // Show success notification
    } catch (error) {
      console.error("Error deleting note:", error); // Log error
      toast.error("Failed to delete note"); // Show error notification
    }
  };

  // Get the currently selected note for editing or preview
  const getCurrentNote = () =>
    filteredNotes.find((note) => note._id === currentNoteId);

  // Add a new note to the list
  const addNote = (newNote) => {
    const noteWithDefaults = {
      noteTitle: newNote.title || "Untitled", // Default title if not provided
      noteContent: newNote.content || "", // Default content if not provided
      ...newNote,
    };

    setNotes((prevNotes) => [noteWithDefaults, ...prevNotes]); // Add to notes
    setFilteredNotes((prevNotes) => [noteWithDefaults, ...prevNotes]); // Add to filtered notes
    setCurrentNoteId(noteWithDefaults._id); // Select the new note
  };

  return (
    <div className="p-5" style={{ height: "calc(100vh - 69px)" }}>
      {/* Page Header */}
      <div display="flex" justifyContent="space-between" alignItems="center">
        <Header title="NOTES" subtitle="Personal notes" />
      </div>

      {/* Main Note Page Layout */}
      <div className="note-page">
        {/* Toast Notification */}
        <ToastContainer />

        {/* Sidebar for Notes */}
        <Sidebar
          notes={filteredNotes} // Pass filtered notes to the sidebar
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
          addNote={addNote}
          deleteNoteById={handleDeleteNote}
        />

        {/* Note Editor/Preview Section */}
        <div className="note-editor" style={{ height: "inherit" }}>
          {/* Header with Tabs and Filter Dropdown */}
          <div className="editor-header">
            {/* Dropdown for filtering notes by task */}
            <select
              value={selectedTaskId}
              onChange={handleTaskFilterChange}
              className="filter-dropdown"
            >
              <option value="">All Notes</option> {/* Show all notes option */}
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.taskName} {/* Show task name in dropdown */}
                </option>
              ))}
            </select>

            {/* Tab Buttons for Edit and Preview Modes */}
            <button
              onClick={() => setIsEditMode(false)} // Switch to Preview mode
              className={`tab-button ${!isEditMode ? "active-tab" : ""}`}
            >
              Preview
            </button>
            <button
              onClick={() => setIsEditMode(true)} // Switch to Edit mode
              className={`tab-button ${isEditMode ? "active-tab" : ""}`}
            >
              Edit
            </button>
          </div>

          {/* Render Note Editor or Preview based on mode */}
          {isEditMode ? (
            <NoteEditor
              currentNote={getCurrentNote()} // Pass the current note for editing
              saveNote={handleSaveNote} // Pass the save function
              notes={notes} // Pass all notes
              setFilteredNotes={setFilteredNotes} // Pass the filtering function
            />
          ) : (
            <div className="note-preview bg-black dark:bg-gray-800 p-6 rounded-lg shadow">
              {currentNoteId ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {getCurrentNote()?.noteTitle ||
                      getCurrentNote()?.title ||
                      "Untitled"}
                  </h2>
                  <div className="prose dark:prose-invert text-gray-800 dark:text-gray-200">
                    {getCurrentNote()?.noteContent ||
                      getCurrentNote()?.content ||
                      "No content available..."}
                  </div>
                </>
              ) : (
                <div className="text-gray-600 dark:text-gray-400 text-center">
                  Please select a note or create a new one.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotePage;
