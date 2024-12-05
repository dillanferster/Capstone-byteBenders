import React, { useState } from "react";
import NoteCard from "./noteCard";
import CreateNoteForm from "./CreateNoteForm";
import { createNote } from "../../api";
import Notification from "./notification";

// reference: https://www.youtube.com/watch?v=571sn_pS4kY
// reference: https://www.youtube.com/watch?v=571sn_pS4kYhttps://blog.danylkecha.com/react-notes-app?x-host=blog.danylkecha.com
// reference: Chatgpt 

const Sidebar = ({
  notes,
  currentNoteId,
  setCurrentNoteId,
  addNote,
  deleteNoteById,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTaskNoteForm, setShowTaskNoteForm] = useState(false);
  const [notification, setNotification] = useState(null);

  // Notification utility
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Function to handle regular note creation
  // Function to handle regular note creation
  const handleCreateNote = async (noteData) => {
    try {
      if (!noteData.title.trim() || !noteData.content.trim()) {
        alert("Title and content are required for creating a note.");
        return;
      }

      const noteToCreate = {
        title: noteData.title.trim(),
        content: noteData.content.trim(),
        taskId: null, // Regular notes have no taskId
      };

      const response = await createNote(noteToCreate);

      if (response && response.acknowledged && response.insertedId) {
        const createdNote = {
          ...noteToCreate,
          _id: response.insertedId,
          noteTitle: noteToCreate.title, // Ensure title is set
          noteContent: noteToCreate.content, // Ensure content is set
        };

        addNote(createdNote); // Add the note to the state
        setShowCreateForm(false);
        showNotification("Note created successfully", "success");
      } else {
        alert("Failed to create note. Please check the server response.");
        showNotification(
          "Failed to create note. Please check the server response.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("An error occurred while creating the note. Please try again.");
      showNotification(
        "An error occurred while creating the note. Please try again.",
        "error"
      );
    }
  };

  // Function to handle task note creation
  const handleCreateTaskNote = async (noteData) => {
    try {
      if (
        !noteData.title.trim() ||
        !noteData.content.trim() ||
        !noteData.taskId
      ) {
        alert("Task note requires a title, content, and a valid task ID.");
        return;
      }

      const noteToCreate = {
        title: noteData.title.trim(),
        content: noteData.content.trim(),
        taskId: noteData.taskId,
      };

      console.log("Creating task note with data:", noteToCreate);

      const response = await createNote(noteToCreate);

      if (response && response.acknowledged && response.insertedId) {
        const createdTaskNote = {
          _id: response.insertedId,
          noteTitle: noteToCreate.title,
          noteContent: noteToCreate.content,
          taskId: noteToCreate.taskId,
          isTaskNote: true,
        };

        addNote(createdTaskNote);
        setShowTaskNoteForm(false);
        showNotification("Task note created successfully", "success");
      } else {
        console.error("Server response:", response);
        alert("Failed to create task note.");
        showNotification("Failed to create task note.", "error");
      }
    } catch (error) {
      console.error("Error creating task note:", error);
      alert("Failed to create task note. Please try again.");
      showNotification(
        "Failed to create task note. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="note-sidebar">
      {/* Buttons to open creation forms */}
      <button
        onClick={() => setShowCreateForm(true)}
        className="add-note-button"
      >
        Create Regular Note
      </button>
      <button
        onClick={() => setShowTaskNoteForm(true)}
        className="add-task-note-button"
      >
        Create Task Note
      </button>

      {/* Regular note creation form */}
      {showCreateForm && (
        <CreateNoteForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateNote}
          isTaskNote={false}
        />
      )}

      {/* Task note creation form */}
      {showTaskNoteForm && (
        <CreateNoteForm
          onClose={() => setShowTaskNoteForm(false)}
          onSubmit={handleCreateTaskNote}
          isTaskNote={true}
        />
      )}

      {/* List of notes */}
      <div className="notes-list" style={{ height: "inherit" }}>
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            isActive={note._id === currentNoteId}
            onClick={() => setCurrentNoteId(note._id)}
            onDelete={deleteNoteById}
          />
        ))}
        {!notes.length && <div>No notes found</div>}
      </div>

      {/* Notification display */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Sidebar;
