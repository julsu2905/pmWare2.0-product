//const crypto = require('crypto');
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const AdminUser = require("../models/admin/adminModel");
//const sendEmail = require('../utils/email');
//Get information token from env
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Create and send token

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Remove password from output
  user.password = undefined;

  return res
    .cookie("jwt", token, cookieOptions)
    .status(statusCode)
    .json({
      status: "success",
      user: { data: user, token },
    });
};

//logout

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

//Login
exports.login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if email & password exists
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Vui lòng nhập email và mật khẩu!",
      });
    }
    //2) check if user exist and passowrd is correct
    const user = await User.findOne({ email, active: true })
      .select("+password")
      .populate({ path: "myProjects", select: "visibility" });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "fail",
        message:
          "Email hoặc mật khẩu sai hoặc tài khoản đã bị khóa, vui lòng thử lại!",
      });
    }
    //3) If everything Ok
    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);
  }
});
exports.loginAdmin = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if email & password exists
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password!",
      });
    }
    //2) check if user exist and passowrd is correct
    const user = await AdminUser.findOne({ email, active: true }).select(
      "+password"
    );
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect email or password , please try again",
      });
    }
    //3) If everything Ok
    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);
  }
});

exports.protectUser = factory.protect(User);
exports.protectUserAdmin = factory.protect(AdminUser);
//Allow user for access route
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const role = res.locals.user.role;
    console.log(role);
    if (!roles.includes(res.locals.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Action restricted",
      });
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const user = await User.findById(decoded.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect current password.",
    });
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
