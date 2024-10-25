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
      setNotes(notesFromDB || []);  // Handle cases where no notes exist yet
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (noteData._id) {
        // Update existing note
        const savedNote = await updateNote(noteData._id, noteData);
        setNotes(prevNotes => prevNotes.map(note => note._id === savedNote._id ? savedNote : note));
      } else {
        // Create a new note
        const savedNote = await createNote(noteData);
        setNotes(prevNotes => [savedNote, ...prevNotes]);
        setCurrentNoteId(savedNote._id);  // Update the current note ID to the newly created one
      }
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
  
      const savedNote = await createNote(newNote);  // Save the new note to the DB
      setNotes(prevNotes => [savedNote, ...prevNotes]);  // Add the new note to the notes list
      setCurrentNoteId(savedNote._id);  // Automatically select the new note for editing
      setIsEditMode(true);  // Switch to edit mode immediately
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

  const getCurrentNote = () => notes.find(note => note._id === currentNoteId);

  return (
    <div className="note-page">
      <div className="note-sidebar">
        <Sidebar
          notes={notes}
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
          addNote={handleAddNote}
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