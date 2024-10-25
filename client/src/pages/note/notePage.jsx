import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/note/sidebar';
import NoteEditor from '../../components/note/noteEditor';
import './NotePage.css';
import { getNotes, createNote, updateNote, deleteNote } from '../../api';

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const notesFromDB = await getNotes();
      if (notesFromDB && notesFromDB.length > 0) {
        setNotes(notesFromDB);
        setCurrentNoteId(notesFromDB[0]._id); // Automatically select the first note
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (noteData._id) {
        // Update existing note
        const savedNote = await updateNote(noteData._id, noteData);
        setNotes(prevNotes =>
          prevNotes.map(note => (note._id === savedNote._id ? savedNote : note))
        );
      } else {
        // Create new note
        const savedNote = await createNote(noteData);
        setNotes([savedNote, ...notes]); // Add the new note to the beginning
        setCurrentNoteId(savedNote._id); // Automatically select the new note
      }
      setIsEditMode(true); // Switch to edit mode after saving
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleAddNote = async () => {
    try {
      const newNote = {
        noteTitle: 'Untitled',
        noteContent: '',
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      };
      const savedNote = await createNote(newNote);
      setNotes([savedNote, ...notes]); // Prepend new note to the notes array
      setCurrentNoteId(savedNote._id); // Select the newly created note
      setIsEditMode(true); // Switch to edit mode to allow immediate editing
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      if (currentNoteId === noteId) {
        setCurrentNoteId(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getCurrentNote = () => {
    return notes.find(note => note._id === currentNoteId);
  };

  return (
    <div className="note-page">
      <div className="note-sidebar">
        <Sidebar
          notes={notes}
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
          addNote={handleAddNote} // This creates a new note when clicked
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
          <NoteEditor
            currentNote={getCurrentNote()}
            saveNote={handleSaveNote}
            autoSave={true} // Enable auto-saving while editing
          />
        ) : (
          <div className="note-preview">
            <h2>{getCurrentNote()?.noteTitle || 'Untitled'}</h2>
            <div className="content">
              {getCurrentNote()?.noteContent || 'No content available...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotePage;
