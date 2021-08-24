const authController = require("../controllers/authController");
const userAdminController = require("../controllers/userAdminController");
const userController = require("../controllers/userController");
const projectController = require("../controllers/projectController");
const advertisementController = require("../controllers/advertisementController");

var express = require("express");
var router = express.Router();

router
  .route("/")
  .get(authController.protectUserAdmin, userAdminController.getAllUsersAdmin)
  .post(
    authController.protectUserAdmin,
    authController.restrictTo("Admin"),
    userAdminController.createUserAdmin
  );

router
  .route("/codes")
  .get(authController.protectUserAdmin, userAdminController.getCodes)
  .post(authController.protectUserAdmin, userAdminController.createCode);
router.route("/codes/:name").get(userAdminController.getCodeByPriceName);

router
  .route("/orders")
  .get(authController.protectUserAdmin, userAdminController.getOrders)
  .post(authController.protectUser, userAdminController.createOrder);

router
  .route("/orders/:id")
  .get(authController.protectUser, userAdminController.getOrder);

router
  .route("/banners")
  .get(userAdminController.getBanners)
  .post(authController.protectUserAdmin, userAdminController.createBanner);
router
  .route("/banners/:id")
  .patch(authController.protectUserAdmin, userAdminController.activeBanner)
  .delete(authController.protectUserAdmin, userAdminController.deleteBanner);
router
  .route("/ads")
  .get(advertisementController.getAllAdvertisement)
  .post(
    authController.protectUserAdmin,
    advertisementController.createAdvertisement
  );
router
  .route("/ads/:id")
  .patch(authController.protectUserAdmin, advertisementController.updateAds)
  .delete(authController.protectUserAdmin, advertisementController.deactiveAds);

router.get(
  "/users",
  authController.protectUserAdmin,
  userController.getAllUsers
);
router
  .route("/users/:id")
  .patch(authController.protectUserAdmin, userController.blockUser);
router.get(
  "/projects",
  authController.protectUserAdmin,
  projectController.getAllProjects
);
router
  .route("/:id")
  .get(authController.protectUserAdmin, userAdminController.getUserAdmin)
  .put(authController.protectUserAdmin, userAdminController.updateMe)
  .delete(authController.protectUserAdmin, userAdminController.deleteMe);

module.exports = router;
