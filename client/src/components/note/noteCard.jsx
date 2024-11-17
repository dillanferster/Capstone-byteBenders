import React from 'react';

const NoteCard = ({ note, isActive, onClick, onDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(note._id);
  };

  return (
    <div 
      className={`note-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="note-content">
        <h3 className="note-title">
          {note.noteTitle || 'Untitled'}
          {note.taskId && <span className="note-task-badge">Task</span>}
        </h3>
      </div>
      <button 
        className="delete-note-button"
        onClick={handleDelete}
        aria-label="Delete note"
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default NoteCard;
