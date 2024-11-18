import React, { useState } from 'react';
import NoteCard from './noteCard';
import CreateNoteForm from './CreateNoteForm';
import { createNote } from '../../api';
import Notification from './notification';

const Sidebar = ({ notes, currentNoteId, setCurrentNoteId, addNote, deleteNoteById }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTaskNoteForm, setShowTaskNoteForm] = useState(false);
  const [notification, setNotification] = useState(null);

  // Notification utility
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Function to handle regular note creation
  const handleCreateNote = async (noteData) => {
    if (!noteData.title || !noteData.content) {
      alert('Title and content are required for creating a note.');
      return;
    }

    const noteToCreate = {
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      taskId: null, // Regular notes have no taskId
    };

    try {
      const response = await createNote(noteToCreate);

      if (response && response.acknowledged && response.insertedId) {
        const createdNote = {
          ...noteToCreate,
          _id: response.insertedId,
        };

        addNote(createdNote); // Add new note to state
        setShowCreateForm(false); // Close the form
        showNotification('Note created successfully', 'success');
      } else {
        console.error('Failed to create note:', response);
        showNotification('Failed to create note. Please check the server response.', 'error');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      showNotification('An error occurred while creating the note. Please try again.', 'error');
    }
  };

  // Function to handle task note creation
  const handleCreateTaskNote = async (noteData) => {
    if (!noteData.title || !noteData.content || !noteData.taskId) {
      alert('Task note requires a title, content, and a valid task ID.');
      return;
    }

    const noteToCreate = {
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      taskId: noteData.taskId, // Ensure taskId is passed correctly
    };

    try {
      const response = await createNote(noteToCreate);

      if (response && response.acknowledged && response.insertedId) {
        const createdTaskNote = {
          ...noteToCreate,
          _id: response.insertedId,
        };

        addNote(createdTaskNote); // Add new task note to state
        setShowTaskNoteForm(false); // Close the form
        showNotification('Task note created successfully', 'success');
      } else {
        console.error('Failed to create task note:', response);
        showNotification('Failed to create task note. Please check the server response.', 'error');
      }
    } catch (error) {
      console.error('Error creating task note:', error);
      showNotification('An error occurred while creating the task note. Please try again.', 'error');
    }
  };

  return (
    <div className="note-sidebar">
      {/* Buttons to open creation forms */}
      <button onClick={() => setShowCreateForm(true)} className="add-note-button">
        Create Regular Note
      </button>
      <button onClick={() => setShowTaskNoteForm(true)} className="add-task-note-button">
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
      <div className="notes-list">
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