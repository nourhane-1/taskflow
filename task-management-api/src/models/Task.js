const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  comments: [{ text: String, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, date: { type: Date, default: Date.now } }],
  activityLog: [{ action: String, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, date: { type: Date, default: Date.now } }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);