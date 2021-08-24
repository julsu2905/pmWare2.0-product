const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "A task must have a code!"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "A task must have a name!"],
  },
  description: {
    type: String,
  },
  status: {
    enum: ["assigned", "working", "pending", "done"],
    type: String,
    default: "assigned",
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dueDate: {
    type: Date,
    required: [true, "A task must have due date"],
  },
  startDate: {
    type: Date,
    required: [true, "A task must have start date"],
  },
  attachment: String,
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: [true, "A subtask must belong to a task"],
  },
});

const SubTask = mongoose.model("SubTask", subTaskSchema, "subtasks");
module.exports = SubTask;
