import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, updateNote }) => {
  const [note, setNote] = useState(currentNote || { title: '', content: '',createdBy: '' });

  useEffect(() => {
    setNote(currentNote || { title: '', content: '' ,createdBy: ''});
  }, [currentNote]);

  const handleSave = () => {
    updateNote({
      ...note,
      updatedAt: Date.now(),
    });
  };

  return (
    <div>
      <input
        type="text"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        placeholder="Note title"
      />
      <textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        placeholder="Note content"
      />
      <button onClick={handleSave} className="save-button">Save</button>
    </div>
  );
};

export default NoteEditor;