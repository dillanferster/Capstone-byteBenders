// NoteEditor.jsx
import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, updateNote }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [noteContent, setNoteContent] = useState(currentNote?.content || '');
  const [noteTitle, setNoteTitle] = useState(currentNote?.title || '');

  // Update the editor fields when the current note changes
  useEffect(() => {
    setNoteTitle(currentNote?.title || '');
    setNoteContent(currentNote?.content || '');
  }, [currentNote]);

  const handleSave = () => {
    if (!currentNote) return;
    const updatedNote = {
      ...currentNote,
      title: noteTitle,
      content: noteContent,
      updatedAt: Date.now(),
    };
    updateNote(updatedNote);
    setIsEditing(false);
  };

  return (
    <div className="note-editor">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Content..."
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <h2>{currentNote?.title}</h2>
          <p>{currentNote?.content}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
