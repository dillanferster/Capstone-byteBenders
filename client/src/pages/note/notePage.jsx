// NotePage.jsx
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
  // Remove duplicate state and functions

  console.log("current notes", notes);
  console.log("current note id", currentNoteId);

  return (
    <div className="note-page">
      <Sidebar className="justify-center"
        notes={notes}
        addNote={addNote}
        deleteNote={deleteNote}
        currentNoteId={currentNoteId}
        setCurrentNoteId={setCurrentNoteId}
        updateNote={updateNote}
      />
      <NoteEditor className="justify-center"
        currentNote={getCurrentNote()}
        updateNote={updateNote}
      />
    </div>
  );
};

export default NotePage;
