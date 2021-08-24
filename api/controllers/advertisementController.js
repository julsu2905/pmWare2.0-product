const day = require("dayjs");
const Price = require("../models/admin/priceModel");
const Order = require("../models/orderModel");
const Code = require("../models/admin/codeModel");
const AdminUser = require("../models/admin/adminModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const Banner = require("../models/admin/bannerModel");
const Advertisement = require("../models/advertisementModel");

//Create User
exports.createAdvertisement = factory.createOne(Advertisement);
exports.getAllAdvertisement = factory.getAll(Advertisement);

//Get All User
exports.getAdvertisement = factory.getOne(Advertisement);
exports.deactiveAds = catchAsync(async (req, res, next) => {
  const ads = await Advertisement.findByIdAndUpdate(
    req.params.id,
    {
      active: false,
    },
    { upsert: true }
  );
  if (!ads) {
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
exports.activeAds = catchAsync(async (req, res, next) => {
  const ads = await Advertisement.findByIdAndUpdate(
    req.params.id,
    {
      active: true,
    },
    { upsert: true }
  );
  if (!ads) {
    return res.status(404).json({
      status: "fail",
      message: "No document found with that ID",
    });
  }
  res.status(200).json({
    status: "success",
  });
});
exports.updateAds = catchAsync(async (req, res, next) => {
  try {
    const doc = await Advertisement.findByIdAndUpdate(
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
