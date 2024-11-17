import React, { useState, useEffect } from 'react';

const NoteEditor = ({ currentNote, saveNote }) => {
  const [note, setNote] = useState({ Title: '', Content: '' });

  // Update the note state when the currentNote prop changes
  useEffect(() => {
    if (currentNote) {
      // Transform the note data to match the expected structure
      setNote({
        _id: currentNote._id,
        title: currentNote.noteTitle || currentNote.title,
        content: currentNote.noteContent || currentNote.content,
        taskId: currentNote.taskId,
        createdBy: currentNote.createdBy,
        dateUpdated: currentNote.dateUpdated
      });
    }
  }, [currentNote]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name === 'noteTitle' ? 'title' : name === 'noteContent' ? 'content' : name;
    
    setNote(prevNote => ({
      ...prevNote,
      [fieldName]: value,
      dateUpdated: new Date().toISOString()
    }));
  };

  const handleSaveClick = () => {
    // Ensure that the note has content and proper structure
    if (note.title.trim() || note.content.trim()) {
      const noteToSave = {
        _id: note._id,
        title: note.title.trim(),
        content: note.content.trim(),
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
        value={note.title || ''}
        placeholder="Note Title"
        onChange={handleInputChange}
        className="note-title-input"
      />
      <textarea
        name="noteContent"
        value={note.content || ''}
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