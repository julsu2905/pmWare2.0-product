const authController = require("../controllers/authController");
const notificationController = require("../controllers/notificationController");
var express = require("express");
var router = express.Router();

router.patch("/markAllAsRead",authController.protectUser,notificationController.markAllNotifications)
router
    .route("/:id")
    .patch(authController.protectUser, notificationController.changeStatusNotification)
    .delete(authController.protectUser, notificationController.removeNotification);
module.exports = router;
