import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, saveNote }) => {
  const [note, setNote] = useState(currentNote || { noteTitle: '', noteContent: '' });

  // Update state when the current note changes
  useEffect(() => {
    setNote(currentNote || { noteTitle: '', noteContent: '' });
  }, [currentNote]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
      dateUpdated: new Date().toISOString(),  // Update the timestamp when note changes
    }));
  };

  const handleSaveClick = () => {
    saveNote(note); // Call the saveNote function with the updated note
  };

  return (
    <div className="note-editor">
      <input
        type="text"
        name="noteTitle"
        value={note.noteTitle || ''}
        placeholder="Note Title"
        onChange={handleInputChange}
        className="note-title-input"
      />
      <textarea
        name="noteContent"
        value={note.noteContent || ''}
        placeholder="Write your note here..."
        onChange={handleInputChange}
        className="note-content-textarea"
      />
      <button onClick={handleSaveClick} className="save-button">
        Save Note
      </button>
    </div>
  );
};

export default NoteEditor;