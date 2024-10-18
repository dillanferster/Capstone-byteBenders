// NotePage.jsx
// Main component for the note-taking app
// references ChatGPT for editing and main reference from https://blog.danylkecha.com/react-notes-app?x-host=blog.danylkecha.com
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/note/sidebar';
import NoteEditor from '../../components//note/noteEditor';
import { nanoid } from 'nanoid';
import './NotePage.css'; // Ensure to add your styles for layout

const NotePage = () => {
  // State to manage the notes
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = JSON.parse(localStorage.getItem('notes'));
      return Array.isArray(savedNotes) ? savedNotes : [];
    } catch {
      return [];
    }
  });

  // State to manage the current note being edited
  const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || null);

  // State to toggle between Edit and Preview modes
  const [isEditMode, setIsEditMode] = useState(true); // Default to edit mode

  // Sync notes with localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Function to add a new note
  const addNote = () => {
    const newNote = {
      id: nanoid(),
      title: 'Untitled',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
    setIsEditMode(true); // Switch to edit mode when adding a new note
  };

  // Function to update the content of a note
  const updateNote = (updatedNote) => {
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  // Function to delete a note
  const deleteNote = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    setCurrentNoteId(prevNotes => prevNotes[0]?.id || null);
  };

  // Get the current note based on currentNoteId
  const getCurrentNote = () => notes.find(note => note.id === currentNoteId);

  return (
    <div className="note-page">
      {/* Sidebar for navigation and adding notes */}
      <div className="note-sidebar">
        <Sidebar
          notes={notes}
          addNote={addNote}
          deleteNote={deleteNote}
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
        />
      </div>
      {/* Editor section */}
      <div className="note-editor">
        <div className="editor-header">
          <button
            onClick={() => setIsEditMode(true)}
            className={isEditMode ? 'active-tab' : ''}
          >
            Edit
          </button>
          <br />
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
            updateNote={updateNote}
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