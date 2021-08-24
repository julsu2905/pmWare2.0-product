const mongoose = require("mongoose");
const validator = require("validator");

const promotionSchema = new mongoose.Schema({
  lastModified: {
    type: Date,
    required: [true, "Please provide Date lastModified!"],
  },
  startDate: {
    type: Date,
    required: [true, "Please provide start Date !"],
  },
  endDate: {
    type: Date,
    required: [true, "Please provide end Date !"],
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    require: [true, "Please provide modifiedBy!"],
  },
  name: {
    type: String,
    require: [true, "Please provide name!"],
  },
  percentDiscount: {
    type: Number,
    required: [true, "Please provide percent Discount!"],
  },
  minimumQuantity: {
    type: Number,
    required: [true, "Please provide minimum quantity!"],
  },
  detail: {
    type: String,
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema, "promotions");
module.exports = Promotion;
