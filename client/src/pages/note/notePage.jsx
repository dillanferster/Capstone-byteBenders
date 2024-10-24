// NotePage.jsx
// Main component for the note-taking app
// references ChatGPT for editing and main reference from https://blog.danylkecha.com/react-notes-app?x-host=blog.danylkecha.com
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/note/sidebar';
import NoteEditor from '../../components//note/noteEditor';
import './NotePage.css'; // Ensure to add your styles for layout
import { getNotes, createNote, updateNote, deleteNote } from '../../api'; 

const NotePage = () => {
  // State to manage the notes retrieved from the database
  const [notes, setNotes] = useState([]); // Initialize with an empty array

  // State to manage the current note being edited
  const [currentNoteId, setCurrentNoteId] = useState(null);

  // State to toggle between Edit and Preview modes
  const [isEditMode, setIsEditMode] = useState(true); // Default to edit mode

  // Fetch notes from the database when the component mounts
  useEffect(() => {
    const fetchNotesFromDB = async () => {
      try {
        const notesFromDB = await getNotes(); // Fetch notes
        console.log('Fetched notes:', notesFromDB); // Log the fetched data for debugging
        setNotes(notesFromDB);
        setCurrentNoteId(notesFromDB[0]?._id || null); // Set first note as current
      } catch (error) {
        console.error('Error fetching notes:', error); // Log any error that occurs during fetch
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
      const savedNote = await createNote(newNote); // Save new note to the database
      console.log('Created note:', savedNote); // Add this log to debug new note creation
      setNotes(prevNotes => [savedNote, ...prevNotes]);
      setCurrentNoteId(savedNote._id); // Ensure _id is used, not id
      setIsEditMode(true); // Switch to edit mode
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Function to update the content of a note
  const updateNoteContent = async (updatedNote) => {
    try {
      const savedNote = await updateNote(updatedNote._id, updatedNote); // Update note in DB
      setNotes(prevNotes =>
        prevNotes.map(note => (note._id === savedNote._id ? savedNote : note))
      );
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Function to delete a note
  const deleteNoteById = async (noteId) => {
    if (!noteId) {
      console.error('No noteId provided for deletion');
      return;
    }
  
    try {
      await deleteNote(noteId);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      setCurrentNoteId(prevNotes[0]?._id || null); // Set to the first note if exists
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Get the current note based on currentNoteId
  const getCurrentNote = () => notes.find(note => note._id === currentNoteId);

  //save the note
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
        const newNote = await createNote(updatedNote); // Ensure this note is passed with title, content, and createdBy
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote._id);
      }
      setIsEditMode(false); // Switch to preview mode after saving
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="note-page">
      {/* Sidebar for navigation and adding notes */}
      <div className="note-sidebar">
        <Sidebar
          notes={notes}
          addNote={addNote}
          deleteNote={deleteNoteById}
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
          saveNote={saveNote}
        />
      </div>
      {/* Editor section */}
      <div className="note-editor" color='black'>
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
            updateNote={updateNoteContent}
            saveNote={saveNote}
            deleteNote={deleteNoteById}
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
