import React, { useState, useEffect } from "react";

const NoteEditor = ({ currentNote, saveNote }) => {
  const [note, setNote] = useState({ noteTitle: "", noteContent: "" }); // State for the currently edited note

  // Update the `note` state whenever the `currentNote` prop changes
  useEffect(() => {
    if (currentNote) {
      setNote({
        _id: currentNote._id,
        noteTitle: currentNote.noteTitle || currentNote.title, // Use `noteTitle` or fallback to `title`
        noteContent: currentNote.noteContent || currentNote.content, // Use `noteContent` or fallback to `content`
        taskId: currentNote.taskId, // Task ID associated with the note
        createdBy: currentNote.createdBy, // User who created the note
        dateUpdated: currentNote.dateUpdated, // Last updated date of the note
      });
    }
  }, [currentNote]); // Run this effect whenever `currentNote` changes

  // Handle input changes for the note title and content fields
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Extract name and value from the event target
    setNote((prevNote) => ({
      ...prevNote, // Keep existing note fields
      [name]: value, // Update the specific field (noteTitle or noteContent)
      dateUpdated: new Date().toISOString(), // Update the `dateUpdated` field to the current timestamp
    }));
  };

  // Handle saving the current note
  const handleSaveClick = () => {
    if (note.noteTitle.trim() || note.noteContent.trim()) {
      // Check if note has a title or content
      const noteToSave = {
        _id: note._id, // Note ID (for updating existing notes)
        noteTitle: note.noteTitle.trim(), // Trimmed note title
        noteContent: note.noteContent.trim(), // Trimmed note content
        taskId: note.taskId, // Task ID associated with the note
        createdBy: note.createdBy, // Creator of the note
        dateUpdated: note.dateUpdated, // Updated timestamp
      };

      saveNote(noteToSave); // Call the `saveNote` function passed as a prop
    } else {
      toast.error("Note cannot be empty"); // Show an error if note is empty
    }
  };

  return (
    <div className="note-editor">
      {/* Input field for note title */}
      <input
        type="text"
        name="noteTitle" // Input field name for the note title
        value={note.noteTitle || ""} // Bind the value to the note title state
        placeholder="Note Title" // Placeholder text for the input field
        onChange={handleInputChange} // Handle changes in the input field
        className="note-title-input" // Apply CSS class for styling
      />

      {/* Textarea for note content */}
      <textarea
        name="noteContent" // Input field name for the note content
        value={note.noteContent || ""} // Bind the value to the note content state
        placeholder="Write your note here..." // Placeholder text for the textarea
        onChange={handleInputChange} // Handle changes in the textarea
        className="note-content-textarea" // Apply CSS class for styling
      />

      {/* Button to save the note */}
      <button onClick={handleSaveClick} className="save-button">
        Save Note
      </button>
    </div>
  );
};

export default NoteEditor;
