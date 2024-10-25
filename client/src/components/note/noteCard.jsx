import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const NoteCard = ({ note, onDelete, isActive, onClick }) => {
  if (!note) return null;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note._id);
    }
  };

  return (
    <div
      className={`note-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="note-content">
        <h4 className="note-title">{note.noteTitle || 'Untitled'}</h4>
        <small>{new Date(note.dateUpdated).toLocaleString()}</small> {/* Updated date */}
      </div>
      <button
        className="delete-note-button"
        onClick={handleDelete}
        title="Delete Note"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default NoteCard;
