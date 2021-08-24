const authController = require("../controllers/authController");
const subTaskController = require("../controllers/subTaskController");
var express = require("express");
var router = express.Router();

router
  .route("/:id")
  .get(authController.protectUser, subTaskController.getSubTask)
  .patch(authController.protectUser, subTaskController.patchingSubTask)
  .put(authController.protectUser, subTaskController.updateSubTask)
  .delete(authController.protectUser, subTaskController.deleteSubTask);

module.exports = router;
