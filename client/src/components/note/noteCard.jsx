// NoteCard.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

const NoteCard = ({ note, deleteNote, currentNoteId, setCurrentNoteId }) => {
  return (
    <div
      className={`note-card ${note.id === currentNoteId ? 'active' : ''}`}
      onClick={() => setCurrentNoteId(note.id)}
    >
      <h4>{note.title || 'Untitled'}</h4>
      <small>{new Date(note.updatedAt).toLocaleString()}</small>
      <Button
        variant="danger"
        size="sm"
        onClick={(e) => {
          e.stopPropagation(); // Prevents selecting the note when clicking delete
          deleteNote(note.id);
        }}
      >
        Delete
      </Button>
    </div>
  );
};

export default NoteCard;
