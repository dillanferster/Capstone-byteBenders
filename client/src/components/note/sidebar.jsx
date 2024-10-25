// Sidebar.jsx
import React from "react";
import { deleteNote } from "../../api";

const Sidebar = ({ notes, setCurrentNoteId, addNote, deleteNoteById }) => {
  return (
    <div className="sidebar">
      <button className="add-note-button" onClick={addNote}>
        + Add Note
      </button>
      {notes.map((note) => (
        <div
          key={note._id}  // Ensure each note has a unique key
          className="note-card"
          onClick={() => setCurrentNoteId(note._id)}
        >
          <div className="note-title">{note.noteTitle || 'Untitled'}</div>
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();  // Prevent the click event from triggering parent div's onClick
              deleteNoteById(note._id);  // Pass the note ID correctly
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
