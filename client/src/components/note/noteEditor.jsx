import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, saveNote }) => {
  const [note, setNote] = useState({ noteTitle: '', noteContent: '' });

  useEffect(() => {
    if (currentNote) {
      setNote({
        _id: currentNote._id,
        noteTitle: currentNote.noteTitle || currentNote.title,
        noteContent: currentNote.noteContent || currentNote.content,
        taskId: currentNote.taskId,
        createdBy: currentNote.createdBy,
        dateUpdated: currentNote.dateUpdated
      });
    }
  }, [currentNote]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value,
      dateUpdated: new Date().toISOString()
    }));
  };

  const handleSaveClick = () => {
    if (note.noteTitle.trim() || note.noteContent.trim()) {
      const noteToSave = {
        _id: note._id,
        noteTitle: note.noteTitle.trim(),
        noteContent: note.noteContent.trim(),
        taskId: note.taskId,
        createdBy: note.createdBy,
        dateUpdated: note.dateUpdated
      };
      
      saveNote(noteToSave);
    } else {
      toast.error('Note cannot be empty');
    }
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