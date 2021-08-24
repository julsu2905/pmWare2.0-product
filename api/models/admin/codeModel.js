const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    required: [true, "Please provide Date!"],
  },
  activatedDate: {
    type: Date,
  },
  code: {
    type: String,
    required: [true, "Please provide code!"],
  },
  activated: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
  },
  userActivate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  premium: {
    type: Number,
    required: [true, "Please provide premium time!"],
  },
  price: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Price",
    required: [true, "Please provide price id!"],
  },
});

const Code = mongoose.model("Code", codeSchema, "codes");
module.exports = Code;
