const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: [true, "A log must have Time"],
    },
    description: {
        type: String,
        required: [true, "A log must have message"],
    },
    actorName: {
        type: String,
        required: [true, "A log must have an actor name"],
    },
    isRead: {
        type: Boolean,
        default: false,
        required: [true, "A log must have status"],
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

const Notification = mongoose.model(
    "Notification",
    notificationSchema,
    "notifications"
);
module.exports = Notification;
