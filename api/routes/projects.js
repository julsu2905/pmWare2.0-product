const authController = require("../controllers/authController");
const projectController = require("../controllers/projectController");
var express = require("express");
var router = express.Router();

router
  .route("/")
  .post(authController.protectUser, projectController.createProject);
router
  .route("/:id")
  .get(authController.protectUser, projectController.getProject)
  .patch(authController.protectUser, projectController.addMember)
  .put(authController.protectUser, projectController.updateProject);
//   .delete(authController.protectUser, projectController.deleteProject);
router.get(
  "/:id/log",
  authController.protectUser,
  projectController.getProjectLog
);
router.patch(
  "/:id/archive",
  authController.protectUser,
  projectController.archiveProject
);
router.patch(
  "/:id/removeMember",
  authController.protectUser,
  projectController.removeMember
);
router.patch(
  "/:id/close",
  authController.protectUser,
  projectController.closeProject
);
router.patch(
  "/:id/grantAuthority",
  authController.protectUser,
  projectController.grantAuthority
);
router.patch(
  "/:id/removeAuthority",
  authController.protectUser,
  projectController.removeAuthority
);
module.exports = router;
