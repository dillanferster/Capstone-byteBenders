import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, saveNote }) => {
  const [note, setNote] = useState({ noteTitle: '', noteContent: '' });

  // Update the note state when the currentNote prop changes
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
    // Ensure that the note is not null or undefined and has content
    if (note.noteTitle.trim() || note.noteContent.trim()) {
      saveNote(note); // Call the saveNote function with the updated note
    } else {
      alert('Note cannot be empty');
    }
  };

  return (
    <div className="note-editor">
      <input
        type="text"
        name="noteTitle"
        value={note.noteTitle || ''} // Ensure the input field is controlled
        placeholder="Note Title"
        onChange={handleInputChange}
        className="note-title-input"
      />
      <textarea
        name="noteContent"
        value={note.noteContent || ''} // Ensure the textarea is controlled
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