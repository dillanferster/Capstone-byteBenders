// Sidebar.jsx
import React from 'react';
import { Stack, Button } from 'react-bootstrap';
import NoteCard from './noteCard'; // Ensure NoteCard displays each note in the list

const Sidebar = ({ notes, addNote, deleteNote, currentNoteId, setCurrentNoteId }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Notes</h2>
        <button onClick={addNote} className="add-note-button">+ Add Note</button>
      </div>
      <div className="note-list">
        {notes.map(note => (
          <div
            key={note.id}
            className={`note-item ${note.id === currentNoteId ? 'active' : ''}`}
            onClick={() => setCurrentNoteId(note.id)}
          >
            {note.title || 'Untitled'}
            <div className="note-title">{note.title}</div>
            <button className="delete-note-button" onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;