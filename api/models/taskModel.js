const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
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
  priority: {
    type: String,
    enum: ["Critical", "Normal", "High", "Low"],
    default: "Normal",
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
  prerequisiteTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  watchers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  subTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTask",
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "A task must belong to a project"],
  },
});

const Task = mongoose.model("Task", taskSchema, "tasks");
module.exports = Task;
