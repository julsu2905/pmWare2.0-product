const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Code = require("../models/admin/codeModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

//Create User
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User, "myProjects userTasks");

exports.updateMe = catchAsync(async (req, res, next) => {
  try {
    if (res.locals.user !== undefined) {
      const updateUser = await User.findByIdAndUpdate(
        res.locals.user._id,
        { ...req.body },
        {
          new: true,
          runValidators: true,
          upsert: true,
        }
      );
      res.status(200).json({
        status: "success",
        user: updateUser,
      });
    }
  } catch (error) {
    console.log(error);
  }
  //2) Filterer out unwanted fields names that are not allowed to be updated
});

exports.blockUser = catchAsync(async (req, res, next) => {
  if (req.body.action === "block") {
    try {
      const check = await User.findById(req.params.id);
      if (check.myProject.length === 0) {
        await User.findByIdAndUpdate(req.params.id, {
          active: false,
        });
        return res.status(200).json({
          status: "success",
        });
      } else
        return res.status(200).json({
          status: "fail",
          message: "Không thể chặn user này!",
        });
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      await User.findByIdAndUpdate(req.params.id, {
        active: true,
      });
      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      console.log(err);
    }
  }
});
exports.getUserProjects = catchAsync(async (req, res, next) => {
  try {
    if (res.locals.user !== undefined) {
      let query = User.findById(res.locals.user._id).populate(
        "myProjects",
        "active archived admin name description visibility _id code createdDate"
      );

      const doc = await query;

      if (!doc) {
        return res.status(404).json({
          status: "fail",
          message: "Người dùng chưa có dự án!",
        });
      }

      return res.status(200).json({
        status: "success",
        data: doc,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
    });
  }
});
//Get All User
exports.getAllUsers = factory.getAll(User, "myProjects userTasks");
exports.activePremium = catchAsync(async (req, res, next) => {
  try {
    if (res.locals.user !== undefined) {
      const check = await Code.findOne({
        code: req.body.code,
        userActivate: null,
      });
      if (!check) {
        return res.status(404).json({
          status: "fail",
          message: "Mã không hợp lệ!",
        });
      }
      const user = await User.findById(res.locals.user._id);
      const doc = await User.findByIdAndUpdate(res.locals.user._id, {
        premium: user.premium + check.premium,
      });
      await Code.findOneAndUpdate(
        { code: req.body.code },
        { userActivate: res.locals.user._id }
      );
      const noti = await Notification.create({
        time: date(),
        description: `Bạn đã kích hoạt tài khoản thành công!`,
        actorName: "Hệ thống",
        project: null,
      });
      await User.findByIdAndUpdate(res.locals.user._id, {
        $push: { notifications: noti._id },
      });
      return res.status(200).json({
        status: "success",
        data: doc,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
    });
  }
});
exports.getUserOrders = catchAsync(async (req, res, next) => {
  try {
    const doc = await Order.find({ user: res.locals.user._id })
      .populate("items.code user", "name email")
      .populate({
        path: "items.code",
        select: "code premium activated userActivate",
        populate: {
          path: "userActivate",
          select: "name -_id",
        },
      });
    if (!doc) {
      return res.status(400).json({
        status: "fail",
        message: "Người dùng chưa có hóa đơn!",
      });
    }

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getNotifications = catchAsync(async (req, res, next) => {
  if (res.locals.user.notifications.length > 0)
    return res.status(200).json({
      status: "success",
      data: res.locals.user.notifications.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      ),
      count: res.locals.user.notifications.filter((x) => !x.isRead).length,
    });
  else
    return res.status(200).json({
      status: "success",
      count: 0,
    });
});
