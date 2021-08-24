const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

//Delete Handle Factory
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

//Update handle factory
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

//Create One handle factory
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    try {
      if (req.files && req.files.avatar) {
        const doc = await Model.create({
          ...req.body,
          avatar: req.files.avatar[0].filename,
        });
        res.status(201).json({
          status: "success",
          data: doc,
        });
      } else {
        const doc = await Model.create(req.body);
        res.status(201).json({
          status: "success",
          data: doc,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.name === "MongoError" && error.code === 11000) {
        res.status(409).json({
          status: "fail",
          message: "Tài khoản hoặc email đã được sử dụng!",
        });
      }
    }
  });

//Get one handle factory
exports.getOne = (Model, popOption, secondPopOption, thirdPopOption) =>
  catchAsync(async (req, res, next) => {
    try {
      let query = Model.findById(req.params.id);
      if (popOption) {
        if (secondPopOption) {
          if (thirdPopOption) {
            query = query.populate({
              path: popOption,
              populate: {
                path: secondPopOption,
                populate: { path: thirdPopOption, select: "name project" },
              },
            });
          } else {
            query = query.populate({
              path: popOption,
              populate: {
                path: secondPopOption,
              },
            });
          }
        } else query = query.populate(popOption);
      }

      const doc = await query;

      if (!doc) {
        return res.status(404).json({
          status: "fail",
          message: "No document found with that ID",
        });
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
    } catch (error) {
      console.log(error);
    }
  });

//Get all handle factory
exports.getAll = (Model, popOptions, sortOptions) =>
  catchAsync(async (req, res, next) => {
    try {
      let filter = {};
      // const doc = await features.query.explain();
      if (Model == "Banner") filter = { active: true };
      let doc;
      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields();
      if (popOptions) {
        if (sortOptions)
          doc = await features.query.populate(popOptions).sort(sortOptions);
        else {
          doc = await features.query.populate(popOptions);
        }
      } else {
        doc = await features.query;
      }

      // SEND RESPONSE
      res.status(200).json({
        status: "success",
        results: doc.length,
        data: doc,
      });
    } catch (error) {
      console.log(error);
    }
  });

//User must login to access resource
exports.protect = (Model) =>
  catchAsync(async (req, res, next) => {
    //1) getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await Model.findById(decoded.id).populate(
      "myProjects notifications"
    );
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist.",
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "User recently changed password! Please log in again.",
      });
    }
    let isPremium = false;
    if (currentUser.premium != 0) isPremium = true;
    // GRANT ACCESS TO PROTECTED ROUTE
    res.locals.user = currentUser;
    res.locals.isPremium = isPremium;
    next();
  });

//Only for rendered page, no errors!
