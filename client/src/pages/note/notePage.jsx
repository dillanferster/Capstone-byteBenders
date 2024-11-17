import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/note/sidebar";
import NoteEditor from "../../components/note/NoteEditor";
import "./NotePage.css";
import { getNotes, createNote, updateNote, deleteNote } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [creatingNote, setCreatingNote] = useState(false);

  // Fetch notes from the DB
  const fetchNotes = async () => {
    try {
      const notesFromDB = await getNotes();
      const updatedNotes = notesFromDB.map((note) => ({
        ...note,
        isTaskNote: !!note.taskId,
      }));
      setNotes(updatedNotes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Save note (updating existing notes)
  const handleSaveNote = async (noteData) => {
    if (!noteData._id) {
      console.error("Note ID is missing");
      toast.error("Cannot update note: Missing ID");
      return;
    }

    try {
      // Transform the note data to match the expected structure
      const noteToUpdate = {
        title: noteData.title || noteData.noteTitle, // Handle both property names
        content: noteData.content || noteData.noteContent, // Handle both property names
        taskId: noteData.taskId || null,
        dateUpdated: new Date().toISOString(),
      };

      console.log("Sending update request with data:", noteToUpdate);

      const updatedNote = await updateNote(noteData._id, noteToUpdate);

      // Update the notes state with the updated note
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteData._id
            ? {
                ...note,
                ...updatedNote,
                isTaskNote: !!updatedNote.taskId,
              }
            : note
        )
      );

      toast.success("Note updated successfully");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note. Please try again.");
    }
  };

  // Delete note by ID
  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      if (currentNoteId === noteId) {
        setCurrentNoteId(null);
      }
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  // Get current note for editing or preview
  const getCurrentNote = () => notes.find((note) => note._id === currentNoteId);

  const addNote = (newNote) => {
    // Ensure the new note has a valid title and content
    const noteWithDefaults = {
      noteTitle: newNote.title || "Untitled",
      noteContent: newNote.content || "",
      ...newNote,
    };

    setNotes((prevNotes) => [noteWithDefaults, ...prevNotes]); // Add new note to the top
    setCurrentNoteId(noteWithDefaults._id); // Select the new note
  };

  return (
    <div className="note-page">
      <ToastContainer />
      <div className="note-sidebar">
        <Sidebar
          notes={notes}
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
          addNote={addNote}
          deleteNoteById={handleDeleteNote}
        />
      </div>

      <div className="note-editor">
        <div className="editor-header">
          <button
            onClick={() => setIsEditMode(true)}
            className={`tab-button ${isEditMode ? "active-tab" : ""}`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsEditMode(false)}
            className={`tab-button ${!isEditMode ? "active-tab" : ""}`}
          >
            Preview
          </button>
        </div>

        {isEditMode ? (
          <NoteEditor
            currentNote={getCurrentNote()}
            saveNote={handleSaveNote}
          />
        ) : (
          <div className="note-preview">
            {currentNoteId ? (
              <>
                <h2>
                  {getCurrentNote()?.title ||
                    getCurrentNote()?.noteTitle ||
                    "Untitled"}
                </h2>
                <div className="content">
                  {getCurrentNote()?.content ||
                    getCurrentNote()?.noteContent ||
                    "No content available..."}
                </div>
              </>
            ) : (
              <div className="no-note">
                Please select a note or create a new one.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotePage;
