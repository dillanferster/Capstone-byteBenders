const express = require('express');
const Note = require('../models/Note');
const Task = require('../models/Task');

const router = express.Router();

// Validation middleware
const validateNoteData = (req, res, next) => {
  const { noteTitle, noteContent } = req.body;
  const errors = {};

  // Title validation
  if (!noteTitle) {
    errors.noteTitle = 'Title is required';
  } else if (noteTitle.length < 3) {
    errors.noteTitle = 'Title must be at least 3 characters long';
  } else if (noteTitle.length > 50) {
    errors.noteTitle = 'Title must be less than 50 characters';
  }

  // Content validation
  if (!noteContent) {
    errors.noteContent = 'Content is required';
  } else if (noteContent.length < 10) {
    errors.noteContent = 'Content must be at least 10 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

router.post('/notes', validateNoteData, async (req, res) => {
  try {
    const { noteTitle, noteContent, taskId } = req.body;
    console.log('Received note data:', req.body);

    const newNote = await Note.create({
      noteTitle: noteTitle || 'Untitled',
      noteContent: noteContent || '',
      taskId: taskId || null,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString()
    });

    if (taskId) {
      await Task.findByIdAndUpdate(
        taskId,
        { $push: { notes: newNote._id } },
        { new: true }
      );
    }

    const savedNote = await Note.findById(newNote._id);
    console.log('Created note:', savedNote);
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/notes/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const notes = await Note.find({ taskId });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching task notes:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.taskId) {
      await Task.findByIdAndUpdate(
        note.taskId,
        { $pull: { notes: note._id } }
      );
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add this new route to check connections
router.get('/notes/check-connections', async (req, res) => {
  try {
    // Find all notes that have taskIds
    const notesWithTasks = await Note.find({ taskId: { $exists: true, $ne: null } });
    
    // Get the related tasks
    const connections = await Promise.all(
      notesWithTasks.map(async (note) => {
        const task = await Task.findById(note.taskId);
        return {
          noteId: note._id,
          noteTitle: note.noteTitle,
          taskId: note.taskId,
          taskName: task ? task.taskName : 'Task not found',
          isTaskValid: !!task
        };
      })
    );

    res.json({
      totalConnections: connections.length,
      connections
    });
  } catch (error) {
    console.error('Error checking connections:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 