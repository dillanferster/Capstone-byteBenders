import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, saveNote }) => {
  const [note, setNote] = useState({
    title: currentNote?.title || '',        // Default to an empty string
    content: currentNote?.content || '',    // Default to an empty string
    createdBy: currentNote?.createdBy || '',// Default to an empty string
  });

  // Update the note state when the currentNote prop changes
  useEffect(() => {
    setNote({
      title: currentNote?.title || '',
      content: currentNote?.content || '',
      createdBy: currentNote?.createdBy || '',
    });
  }, [currentNote]);
  const handleSave = () => {
    if (!note.title && !note.content && !note.createdBy) {
      console.error('All fields are empty. Please enter values.');
      return;
    }
    saveNote(note); // Send the updated note to the parent component
  };

  return (
    <div>
          <input
            type="text"
            value={note.title || ''}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="Note Title"
          />
          <textarea
            value={note.content || ''}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            placeholder="Note Content"
          />
          <input
            type="text"
            value={note.createdBy || ''}
            onChange={(e) => setNote({ ...note, createdBy: e.target.value })}
            placeholder="Created By"
          />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default NoteEditor;
