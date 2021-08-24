const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
  },
  createdDate: {
    type: Date,
    required: [true, "Please provide Date!"],
  },
  lastModified: {
    type: Date,
  },
  link: {
    type: String,
    required: [true, "Please provide link!"],
  },
  name: {
    type: String,
    required: [true, "Please provide ads name!"],
  },
  price: {
    type: Number,
    required: [true, "Please provide ads price!"],
  },
  startDate: {
    type: Date,
    required: [true, "Please provide ads start Date!"],
  },
  endDate: {
    type: Date,
    required: [true, "Please provide ads end Date!"],
  },
  active: { type: Boolean, default: true },
});

const Advertisement = mongoose.model(
  "Advertisement",
  advertisementSchema,
  "advertisements"
);
module.exports = Advertisement;
