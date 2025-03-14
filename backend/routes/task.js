const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  firstName: { type: String, },
  phone: { type: Number },
  notes: { type: String, required: false },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
