import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const NoteCard = ({ note, deleteNote, currentNoteId, setCurrentNoteId }) => {
  return (
    <div
      className={`note-card ${note.id === currentNoteId ? 'active' : ''}`}
      onClick={() => setCurrentNoteId(note.id)}
    >
      <h4>{note.title || 'Untitled'}</h4>
      <small>{new Date(note.updatedAt).toLocaleString()}</small>
      <FontAwesomeIcon
        icon={faTrash}
        className="icon-btn delete-icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent clicking the delete icon from selecting the note
          deleteNote(note.id);
        }}
        title="Delete Note"
      />
    </div>
  );
};

export default NoteCard;