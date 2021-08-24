const mongoose = require("mongoose");

const historyLogSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: [true, "A log must have Time"],
  },
  message: {
    type: String,
    required: [true, "A log must have message"],
  },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

const HistoryLog = mongoose.model(
  "HistoryLog",
  historyLogSchema,
  "historylogs"
);
module.exports = HistoryLog;
