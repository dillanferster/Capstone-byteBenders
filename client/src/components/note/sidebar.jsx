import React, { useState } from 'react';
import NoteCard from './noteCard';
import CreateNoteForm from './CreateNoteForm';
import { createNote } from '../../api';

const Sidebar = ({ notes, currentNoteId, setCurrentNoteId, addNote, deleteNoteById }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTaskNoteForm, setShowTaskNoteForm] = useState(false);

  const handleCreateNote = async (noteData) => {
    try {
      const noteToCreate = {
        noteTitle: noteData.title,
        noteContent: noteData.content
      };

      console.log('Creating note with data:', noteToCreate);
      const response = await createNote(noteToCreate);
      
      // Check if we have a valid note object
      if (response && response._id) {
        console.log('Created note:', response);
        addNote(response);
        setShowCreateForm(false);
      } else {
        console.error('Invalid note response:', response);
        alert('Failed to create note properly');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    }
  };

  const handleCreateTaskNote = async (noteData) => {
    try {
      const noteToCreate = {
        noteTitle: noteData.title,
        noteContent: noteData.content,
        taskId: noteData.taskId
      };

      console.log('Creating task note with data:', noteToCreate);
      const response = await createNote(noteToCreate);
      
      // Check if we have a valid note object
      if (response && response._id) {
        console.log('Created task note:', response);
        addNote(response);
        setShowTaskNoteForm(false);
      } else {
        console.error('Invalid task note response:', response);
        alert('Failed to create task note properly');
      }
    } catch (error) {
      console.error('Error creating task note:', error);
      alert('Failed to create task note. Please try again.');
    }
  };

  return (
    <div className="note-sidebar">
      <div className="create-buttons">
        <button 
          className="add-note-button"
          onClick={() => setShowCreateForm(true)}
        >
          Create Regular Note
        </button>
        <button 
          className="add-task-note-button"
          onClick={() => setShowTaskNoteForm(true)}
        >
          Create Task Note
        </button>
      </div>

      <div className="notes-list">
        {Array.isArray(notes) && notes.map((note) => (
          <NoteCard
            key={note._id || `temp-${Date.now()}`} // Ensure unique key even for new notes
            note={note}
            isActive={note._id === currentNoteId}
            onClick={() => setCurrentNoteId(note._id)}
            onDelete={deleteNoteById}
          />
        ))}

        {(!notes || notes.length === 0) && 
          <div className="empty-notes">No notes yet. Create one!</div>
        }
      </div>

      {showCreateForm && (
        <CreateNoteForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateNote}
          isTaskNote={false}
        />
      )}

      {showTaskNoteForm && (
        <CreateNoteForm
          onClose={() => setShowTaskNoteForm(false)}
          onSubmit={handleCreateTaskNote}
          isTaskNote={true}
        />
      )}
    </div>
  );
};

export default Sidebar;