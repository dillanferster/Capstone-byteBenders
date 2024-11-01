const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  noteTitle: {
    type: String,
    required: true
  },
  noteContent: {
    type: String,
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema); 