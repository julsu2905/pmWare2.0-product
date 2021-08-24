const day = require("dayjs");
const Price = require("../models/admin/priceModel");
const Order = require("../models/orderModel");
const Code = require("../models/admin/codeModel");
const AdminUser = require("../models/admin/adminModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const Banner = require("../models/admin/bannerModel");
const Promotion = require("../models/promotionModel");

//Create User
exports.createPromotion = factory.createOne(Promotion);
exports.getAllPromotion = factory.getAll(Promotion);

//Get All User
exports.getPromotion = factory.getOne(Promotion);
exports.deactivePromotion = catchAsync(async (req, res, next) => {
  const promotion = await Promotion.findByIdAndUpdate(
    req.params.id,
    {
      active: false,
    },
    { upsert: true }
  );
  if (!promotion) {
    return res.status(404).json({
      status: "fail",
      message: "No document found with that ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});
exports.activePromotion = catchAsync(async (req, res, next) => {
  const promotion = await Promotion.findByIdAndUpdate(
    req.params.id,
    {
      active: true,
    },
    { upsert: true }
  );
  if (!promotion) {
    return res.status(404).json({
      status: "fail",
      message: "No document found with that ID",
    });
  }
  res.status(200).json({
    status: "success",
  });
});
exports.updatePromotion = catchAsync(async (req, res, next) => {
  try {
    const doc = await Promotion.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        modifiedBy: res.locals.user._id,
        lastModified: day(),
      },
      { new: true }
    );

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    console.log(error);
  }
});
