// NotePage.jsx
// Main component for the note-taking app
// references ChatGPT for editing and main reference from https://blog.danylkecha.com/react-notes-app?x-host=blog.danylkecha.com
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/note/sidebar';
import NoteEditor from '../../components//note/noteEditor';
import './NotePage.css'; // Ensure to add your styles for layout
import { getNotes, createNote, updateNote, deleteNote } from '../../api'; 

const NotePage = () => {
  const [notes, setNotes] = useState([]); // Manage all notes
  const [currentNoteId, setCurrentNoteId] = useState(null); // Track current note
  const [isEditMode, setIsEditMode] = useState(true); // Toggle between Edit and Preview

  // Fetch notes from the database on mount
  useEffect(() => {
    const fetchNotesFromDB = async () => {
      try {
        const notesFromDB = await getNotes();
        if (notesFromDB && notesFromDB.length > 0) {
          setNotes(notesFromDB); // Set notes to state
          setCurrentNoteId(notesFromDB[0]._id); // Set the first note as current
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotesFromDB();
  }, []);

  // Function to add a new note
  const addNote = async () => {
    const newNote = {
      title: 'Untitled',
      content: '',
      updatedAt: Date.now(),
    };
    try {
      const savedNote = await createNote(newNote);
      setNotes([savedNote, ...notes]); // Prepend the new note
      setCurrentNoteId(savedNote._id);
      setIsEditMode(true); // Switch to edit mode
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Function to update an existing note
  const updateNoteContent = async (updatedNote) => {
    try {
      const savedNote = await updateNote(updatedNote._id, updatedNote);
      setNotes(notes.map(note => (note._id === savedNote._id ? savedNote : note)));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Function to delete a note
  const deleteNoteById = async (noteId) => {
    try {
      if (noteId) { // Ensure noteId is not undefined
        await deleteNote(noteId); // Make the API call
        setNotes(notes.filter(note => note._id !== noteId)); // Remove note from state
        setCurrentNoteId(notes.length > 1 ? notes[0]._id : null); // Set first note as current
      } else {
        console.error("No noteId provided for deletion");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };


  // Save the note (handles both new and updated notes)
  const saveNote = async (updatedNote) => {
    try {
      if (updatedNote._id) {
        // If the note already exists, update it
        const savedNote = await updateNote(updatedNote._id, updatedNote);
        setNotes(prevNotes =>
          prevNotes.map(note => (note._id === savedNote._id ? savedNote : note))
        );
      } else {
        // If it's a new note, create it
        const newNote = await createNote(updatedNote);
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote._id);
      }
      setIsEditMode(false); // Switch to preview mode after saving
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };
   // Get the currently selected note
   const getCurrentNote = () => {
    if (currentNoteId) {
      return notes.find(note => note._id === currentNoteId);
    }
    return null;  // Or a default blank note if necessary
  };

return (
  <div className="note-page">
    <div className="note-sidebar">
      <Sidebar
        notes={notes}
        addNote={addNote}
        deleteNoteById={deleteNoteById}
        currentNoteId={currentNoteId}
        setCurrentNoteId={setCurrentNoteId}
        saveNote={saveNote}
        updateNote={updateNoteContent}
      />
    </div>

    <div className="note-editor" color="black">
      <div className="editor-header">
        <button
          onClick={() => setIsEditMode(true)}
          className={isEditMode ? 'active-tab' : ''}
        >
          Edit
        </button>
        <button
          onClick={() => setIsEditMode(false)}
          className={!isEditMode ? 'active-tab' : ''}
        >
          Preview
        </button>
      </div>

      {isEditMode ? (
        <NoteEditor
          currentNote={getCurrentNote()}
          updateNote={updateNoteContent}  /* This is used to update the content */
          saveNote={saveNote}  /* This handles both new and existing notes */
          deleteNote={deleteNoteById}  /* Handles the deletion */
        />
      ) : (
        <div className="note-preview">
          <h2>{getCurrentNote()?.title || 'Untitled'}</h2>
          <p>{getCurrentNote()?.content || 'No content available...'}</p>
        </div>
      )}
    </div>
  </div>
);
};

export default NotePage;
