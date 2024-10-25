import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/note/Sidebar';
import NoteEditor from '../../components/note/NoteEditor';
import './NotePage.css';
import { getNotes, createNote, updateNote, deleteNote } from '../../api';

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [creatingNote, setCreatingNote] = useState(false); // To track the creation state

  // Fetch notes from the DB
  const fetchNotes = async () => {
    try {
      const notesFromDB = await getNotes();
      setNotes(notesFromDB || []); // Handle cases where no notes exist yet
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes(); // Fetch notes on initial render
  }, []);

  // Save note (for both updating and creating new notes)
  const handleSaveNote = async (noteData) => {
    try {
      if (noteData && noteData._id) {
        // Update existing note
        const savedNote = await updateNote(noteData._id, noteData);
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note._id === savedNote._id ? savedNote : note))
        );
      } else {
        // Create new note
        const savedNote = await createNote(noteData);
        setNotes((prevNotes) => [savedNote, ...prevNotes]);
        setCurrentNoteId(savedNote._id); // Select the new note
      }
      setCreatingNote(false); // Reset the creating state after saving
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Create a new note (only one at a time)
  const handleAddNote = async () => {
    if (creatingNote) return; // Prevent creating multiple notes at once

    try {
      setCreatingNote(true); // Set creating note state to true to prevent another creation
      const newNote = {
        noteTitle: 'Untitled', // Default title for new notes
        noteContent: '', // Default content
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      };

      const savedNote = await createNote(newNote); // Save the new note to the DB
      setNotes((prevNotes) => [savedNote, ...prevNotes]); // Add the new note to the list
      setCurrentNoteId(savedNote._id); // Select the new note for editing
      setIsEditMode(true); // Switch to edit mode
    } catch (error) {
      console.error('Error creating new note:', error);
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
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Get current note for editing or preview
  const getCurrentNote = () => notes.find((note) => note._id === currentNoteId);

  return (
    <div className="note-page">
      <div className="note-sidebar">
        <Sidebar
          notes={notes}
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
          addNote={handleAddNote} // Create a new note when clicked
          deleteNoteById={handleDeleteNote}
        />
      </div>

      <div className="note-editor">
        <div className="editor-header">
          <button
            onClick={() => setIsEditMode(true)}
            className={`tab-button ${isEditMode ? 'active-tab' : ''}`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsEditMode(false)}
            className={`tab-button ${!isEditMode ? 'active-tab' : ''}`}
          >
            Preview
          </button>
        </div>

        {isEditMode ? (
          <NoteEditor currentNote={getCurrentNote()} saveNote={handleSaveNote} />
        ) : (
          <div className="note-preview">
            {currentNoteId ? (
              <>
                <h2>{getCurrentNote()?.noteTitle || 'Untitled'}</h2>
                <div className="content">
                  {getCurrentNote()?.noteContent || 'No content available...'}
                </div>
              </>
            ) : (
              <div className="no-note">Please select a note or create a new one.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotePage;