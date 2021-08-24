const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "A project must have code"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "A project must have name"],
  },
  memberQuantity: {
    type: Number,
    required: [true, "A project must have member quantity"],
    default: 3,
  },
  description: {
    type: String,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  active: { type: Boolean, default: true },
  archived: { type: Boolean, default: false },
  createdDate: String,
  endDate: String,
  visibility: {
    type: String,
    enum: ["private", "open"],
    default: "open",
  },
});

const Project = mongoose.model("Project", projectSchema, "projects");
module.exports = Project;
