import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/note/sidebar";
import NoteEditor from "../../components/note/noteEditor";
import "./NotePage.css";
import { getNotes, createNote, updateNote, deleteNote } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";

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
        isTaskNote: Boolean(note.taskId), // More explicit conversion
        noteTitle: note.noteTitle || note.title, // Handle both property names
        noteContent: note.noteContent || note.content, // Handle both property names
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
      const noteToUpdate = {
        noteTitle: noteData.noteTitle,
        noteContent: noteData.noteContent,
        taskId: noteData.taskId || null,
        dateUpdated: new Date().toISOString(),
      };
  
      console.log("Sending update request with data:", noteToUpdate);
  
      const updatedNote = await updateNote(noteData._id, noteToUpdate);
  
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
    <div className="m-5">
      <div display="flex" justifyContent="space-between" alignItems="center">
        <Header title="NOTES" subtitle="Personal notes" />
      </div>
      <div className="note-page">
        <ToastContainer />
        <div className="note-sidebar" align="center">
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
            <div className="note-preview bg-black dark:bg-gray-800 p-6 rounded-lg shadow">
              {currentNoteId ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {getCurrentNote()?.noteTitle || getCurrentNote()?.title || "Untitled"}
                  </h2>
                  <div className="prose dark:prose-invert text-gray-800 dark:text-gray-200">
                    {getCurrentNote()?.noteContent || getCurrentNote()?.content || "No content available..."}
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
