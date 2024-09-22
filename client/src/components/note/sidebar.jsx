// Sidebar.jsx
import React from 'react';
import { Stack, Button } from 'react-bootstrap';
import NoteCard from './noteCard'; // Ensure NoteCard displays each note in the list

const Sidebar = ({ notes, addNote, deleteNote, currentNoteId, setCurrentNoteId }) => {
  return (
    <div className="sidebar border-end">
      <Stack direction="horizontal" className="p-3 border-bottom">
        <h1>Notes</h1>
        <Button variant="primary" className="ms-auto" onClick={addNote}>
          Add Note
        </Button>
      </Stack>
      <Stack>
        {notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            deleteNote={deleteNote}
            currentNoteId={currentNoteId}
            setCurrentNoteId={setCurrentNoteId}
          />
        ))}
      </Stack>
    </div>
  );
};

export default Sidebar;
