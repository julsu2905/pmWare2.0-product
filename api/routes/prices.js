const authController = require("../controllers/authController");
const userAdminController = require("../controllers/userAdminController");

var express = require("express");
var router = express.Router();

router
  .route("/")
  .get(userAdminController.getPrices)
  .post(authController.protectUserAdmin, userAdminController.createPrice);

router.get("/get/name", userAdminController.getPriceNames);

router.get("/:name", userAdminController.getPrice);
router.put(
  "/:id",
  authController.protectUserAdmin,
  userAdminController.editPrice
);
router.delete(
  "/:id",
  authController.protectUserAdmin,
  userAdminController.deletePrice
);
router.patch(
  "/:id",
  authController.protectUserAdmin,
  userAdminController.unblockPrice
);
module.exports = router;
