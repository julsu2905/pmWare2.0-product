const authController = require("../controllers/authController");
const fs = require("fs");
var express = require("express");
var router = express.Router();

router.post("/image", (req, res, next) => {
  try {
    const file = req.files;
    if (!file) {
      return res
        .status(400)
        .json({ status: "fail", message: "No file received!" });
    }
    res.send(file);
  } catch (error) {
    console.log(error);
  }
});
router.delete("/image/users/:name", (req, res, next) => {
  try {
    const fileName = req.params.name;
    fs.unlink("./public/img/user/" + fileName, (err) => {
      err && console.log(err);
      return res
        .status(200)
        .json({ status: "success", message: "Delete image successfully" });
    });
  } catch (error) {
    console.log(error);
  }
});
router.delete(
  "/image/banners/:name",
  authController.protectUserAdmin,
  (req, res, next) => {
    try {
      const fileName = req.params.name;
      fs.unlink("./public/img/banner/" + fileName, (err) => {
        err && console.log(err);
        return res
          .status(200)
          .json({ status: "success", message: "Delete image successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }
);
router.post("/file", (req, res, next) => {
  try {
    const file = req.files;
    if (!file) {
      return res
        .status(400)
        .json({ status: "fail", message: "No file received!" });
    }
    res.send(file);
  } catch (error) {
    console.log(error);
  }
});
router.delete("/file/:name", (req, res, next) => {
  try {
    const fileName = req.params.name;
    fs.unlink("./public/uploads/" + fileName, (err) => {
      err && console.log(err);
      return res
        .status(200)
        .json({ status: "success", message: "Delete file successfully" });
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
