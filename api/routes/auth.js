const authController = require("../controllers/authController");
var express = require("express");
var router = express.Router();

router.post("/login", authController.login);
router.post("/loginAdmin", authController.loginAdmin);
router.get("/logout", authController.logout);
router.post("/images");
router.get("/images/:fileName", (req, res) => {
  res.sendFile(path.join(__dirname, `./img/user/${req.params.fileName}`));
});
module.exports = router;
