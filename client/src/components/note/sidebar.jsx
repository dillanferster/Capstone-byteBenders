import React from 'react';
import NoteCard from '../../components/note/noteCard';

const Sidebar = ({ notes, currentNoteId, setCurrentNoteId, addNote, deleteNoteById }) => {
  return (
    <div className="sidebar">
      <button className="add-note-button" onClick={addNote}>
        + Create Note
      </button>

      <div className="notes-list">
        {notes.map((note) => (
          <NoteCard
            key={note._id} // Ensure each note has a unique key
            note={note}
            isActive={note._id === currentNoteId}
            onClick={() => setCurrentNoteId(note._id)}
            onDelete={deleteNoteById}
          />
        ))}

        {notes.length === 0 && <div className="empty-notes">No notes yet. Create one!</div>}
      </div>
    </div>
  );
};

export default Sidebar;