const mongoose = require("mongoose");
const validator = require("validator");

const priceSchema = new mongoose.Schema({
  lastModified: {
    type: Date,
    required: [true, "Please provide Date lastModified!"],
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    require: [true, "Please provide modifiedBy!"],
  },
  name: {
    type: String,
    required: [true, "Please provide price name!"],
  },
  price: {
    type: Number,
    required: [true, "Please provide price!"],
  },
  currency: {
    type: String,
    enum: ["VND", "USD"],
    required: [true, "Please provide currency!"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Price = mongoose.model("Price", priceSchema, "prices");
module.exports = Price;
