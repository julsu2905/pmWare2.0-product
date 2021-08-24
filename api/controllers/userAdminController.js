const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Price = require("../models/admin/priceModel");
const Order = require("../models/orderModel");
const Code = require("../models/admin/codeModel");
const AdminUser = require("../models/admin/adminModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const Banner = require("../models/admin/bannerModel");

//Create User
exports.createUserAdmin = factory.createOne(AdminUser);
exports.getUserAdmin = factory.getOne(AdminUser);
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  try {
    if (res.locals.user !== undefined) {
      const filteredBody = filterObj(req.body, "email");
      const updateUser = await AdminUser.findByIdAndUpdate(
        res.locals.user.id,
        filteredBody,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        user: updateUser,
      });
    }
  } catch (error) {
    console.log(error);
  }
  //2) Filterer out unwanted fields names that are not allowed to be updated
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  try {
    if (res.locals.user !== undefined) {
      await AdminUser.findByIdAndRemove(res.locals.user._id);
      res.status(200).json({
        status: "success",
        data: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

//Get All User
exports.getAllUsersAdmin = factory.getAll(AdminUser);
exports.getBanners = factory.getAll(Banner, "createdBy");
exports.createBanner = factory.createOne(Banner);
exports.deleteBanner = catchAsync(async (req, res, next) => {
  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    {
      active: false,
    },
    { upsert: true }
  );
  if (!banner) {
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
exports.activeBanner = catchAsync(async (req, res, next) => {
  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    {
      active: true,
    },
    { upsert: true }
  );
  if (!banner) {
    return res.status(404).json({
      status: "fail",
      message: "No document found with that ID",
    });
  }
  res.status(200).json({
    status: "success",
  });
});
exports.getPrices = factory.getAll(Price, "modifiedBy", "+lastModified");
exports.getOrders = factory.getAll(Order, "user items.code", "-createdDate");
exports.getPrice = catchAsync(async (req, res, next) => {
  try {
    const check = await Price.findOne({
      name: req.params.name,
      currency: req.query.c,
    }).select("price name");
    if (!check)
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    return res.status(201).json({
      status: "success",
      check,
    });
  } catch (error) {
    console.log(error);
  }
});
exports.getPriceNames = catchAsync(async (req, res, next) => {
  try {
    const priceNames = await Price.find();
    const nameSet = [];
    priceNames.forEach((price) => {
      if (!nameSet.includes(price.name)) {
        nameSet.push(price.name);
      }
    });
    return res.status(201).json({
      status: "success",
      data: nameSet,
    });
  } catch (error) {
    console.log(error);
  }
});
exports.createPrice = catchAsync(async (req, res, next) => {
  try {
    const check = await Price.findOne({
      name: req.body.name,
      currency: req.body.currency,
      active: true,
    });
    if (check) {
      return res.status(409).json({
        status: "fail",
        message: "This price's already exist! Please consider edit!",
      });
    }
    const doc = await Price.create(req.body);

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    console.log(error);
  }
});
exports.deletePrice = catchAsync(async (req, res, next) => {
  try {
    const check = await Price.findByIdAndUpdate(req.params.id, {
      active: false,
    });

    return res.status(201).json({
      status: "success",
      data: check,
    });
  } catch (error) {
    console.log(error);
  }
});
exports.unblockPrice = catchAsync(async (req, res, next) => {
  try {
    const check = await Price.findByIdAndUpdate(req.params.id, {
      active: true,
    });

    return res.status(201).json({
      status: "success",
      data: check,
    });
  } catch (error) {
    console.log(error);
  }
});
exports.createOrder = catchAsync(async (req, res, next) => {
  try {
    const doc = await Order.create(req.body);
    await Code.findByIdAndUpdate(req.body.items[0].code, {
      activated: true,
    });
    const noti = await Notification.create({
      time: date(),
      description: `Bạn đã mua gói thành công!`,
      actorName: "Hệ thống",
      project: null,
    });
    await User.findByIdAndUpdate(res.locals.user._id, {
      $push: { notifications: noti._id },
    });
    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    console.log(error);
  }
});
exports.getOrder = catchAsync(async (req, res, next) => {
  try {
    let doc = await Order.findById(req.params.id)
      .populate("items.code")
      .populate("user", "name email");

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    }

    return res.status(200).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.editPrice = factory.updateOne(Price);
exports.getCodes = factory.getAll(Code, "createdBy price userActivate");
exports.getCodeByPriceName = catchAsync(async (req, res, next) => {
  try {
    const check = await Code.find({ activated: false })
      .populate("price")
      .select("price code");
    let availableCode;
    check.forEach((code) => {
      if (code.price.name === req.params.name.toString()) {
        availableCode = code;
      }
    });

    return res.status(201).json({
      status: "success",
      data: availableCode,
    });
  } catch (error) {
    console.log(error);
  }
});
exports.createCode = catchAsync(async (req, res, next) => {
  try {
    const check = await Code.findOne({ code: req.body.code });
    if (check)
      return res.status(409).json({
        status: "fail",
        message: "This code's already exist!",
      });
    const doc = await Code.create(req.body);
    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    console.log(error);
  }
});
