const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate:     { type: Date },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);