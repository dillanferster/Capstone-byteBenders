const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // ... other task fields ...
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

module.exports = mongoose.model('Task', taskSchema); 