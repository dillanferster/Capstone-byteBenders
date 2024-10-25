import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, updateNote, saveNote }) => {
  const [note, setNote] = useState(currentNote || { title: '', content: '' });

  // Update note state when currentNote changes
  useEffect(() => {
    setNote(currentNote || { title: '', content: '' });
  }, [currentNote]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value,  // Update either title or content
    }));
  };

  const handleSave = () => {
    saveNote(note);  // Pass the updated note to be saved
  };

  return (
    <div className="note-editor">
      <input
        name="title"
        className="note-title-input"
        value={note.title}
        placeholder="Note Title"
        onChange={handleInputChange}  // Handle title change
      />
      <textarea
        name="content"
        className="note-content-textarea"
        value={note.content}
        placeholder="Write your note here..."
        onChange={handleInputChange}  // Handle content change
      />
      <button onClick={handleSave}>Save Note</button>
    </div>
  );
};

export default NoteEditor;
