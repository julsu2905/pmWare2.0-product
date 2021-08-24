const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const advertisementController = require("../controllers/advertisementController");
var express = require("express");
var router = express.Router();

router.post("/", userController.createUser);
router.get("/", authController.protectUser, userController.getAllUsers);
router.get(
    "/projects",
    authController.protectUser,
    userController.getUserProjects
);
router
    .route("/userOrders")
    .get(authController.protectUser, userController.getUserOrders);
router
    .route("/userNotis")
    .get(authController.protectUser, userController.getNotifications);
router.route("/ads").get(advertisementController.getAllAdvertisement);
router
    .route("/:id")
    .get(authController.protectUser, userController.getUser)
    .put(authController.protectUser, userController.updateMe)
    .patch(authController.protectUser, userController.activePremium);

module.exports = router;
