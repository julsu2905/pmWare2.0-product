const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
  },
  createdDate: {
    type: Date,
    required: [true, "Please provide Date!"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Banner = mongoose.model("Banner", bannerSchema, "banners");
module.exports = Banner;
