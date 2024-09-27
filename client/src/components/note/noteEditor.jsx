import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, updateNote }) => {
  const [noteContent, setNoteContent] = useState(currentNote?.content || '');
  const [noteTitle, setNoteTitle] = useState(currentNote?.title || '');

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
  };

  return (
    <div className="note-editor-container">
      <div className="editor-mode">
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Untitled"
        />
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Content..."
        />
        <button className="add-note-button" onClick={handleSave}>
          Save
        </button>
      </div>
      <div className="preview-mode">
        <div className="preview-title">Preview</div>
        <h2>{noteTitle || 'Untitled'}</h2>
        <p>{noteContent || 'No content available...'}</p>
      </div>
    </div>
  );
};

export default NoteEditor;