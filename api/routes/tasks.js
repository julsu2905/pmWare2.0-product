const authController = require("../controllers/authController");
const taskController = require("../controllers/taskController");
var express = require("express");
var router = express.Router();

router.route("/").post(authController.protectUser, taskController.createTask);
router
  .route("/getLatestDueDate")
  .post(authController.protectUser, taskController.getLatestDueDate);
router
  .route("/:id")
  .get(authController.protectUser, taskController.getTask)
  .put(authController.protectUser, taskController.updateTask)
  .post(authController.protectUser, taskController.createSubTask)
  .delete(authController.protectUser, taskController.deleteTask);

module.exports = router;
