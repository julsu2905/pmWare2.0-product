const date = require("dayjs");
const catchAsync = require("./../utils/catchAsync");
const sendMail = require("./../utils/email");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const taskController = require("./taskController");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const SubTask = require("../models/subTaskModel");
const Banner = require("../models/admin/bannerModel");
const HistoryLog = require("../models/historyLogModel");
const Notification = require("../models/notificationModel");

exports.createProject = catchAsync(async (req, res, next) => {
  try {
    if (req.body.visibility === "private") {
      if (!res.locals.isPremium) {
        if (
          res.locals.user.myProjects.filter(
            (project) => project.visibility === "private"
          ).length +
            1 >
          5
        )
          return res.status(400).json({
            status: "fail",
            message:
              "Số dự án riêng tư của tài khoản này đã đến giới hạn! Vui lòng nâng cấp tài khoản!",
          });
      }
    }
    let project = await Project.findOne({
      name: req.body.name,
      active: true,
    });
    if (project)
      return res.status(400).json({
        status: "fail",
        message: "Tên dự án đã tồn tại!",
      });

    project = await Project.findOne({ code: req.body.code, active: true });
    if (project)
      return res.status(400).json({
        status: "fail",
        message: "Mã dự án đã tồn tại!",
      });
    const newProject = {
      name: req.body.name,
      code: req.body.code,
      memberQuantity: req.body.memberQuantity,
      description: req.body.description,
      admin: res.locals.user._id,
      members: [res.locals.user._id],
      visibility: req.body.visibility,
      createdDate: date(),
    };
    const doc = await Project.create(newProject);
    await User.findByIdAndUpdate(
      res.locals.user._id,
      {
        $push: { myProjects: doc._id },
      },
      {
        new: true,
      }
    );
    await HistoryLog.create({
      time: date(),
      message: "Dự án được khởi tạo bởi " + res.locals.user.name,
      project: doc._id,
    });
    const noti = await Notification.create({
      time: date(),
      description: "Dự án được khởi tạo bởi " + res.locals.user.name,
      actorName: doc.name,
      project: doc._id,
    });
    res.locals.user.notifications.push(noti);
    await res.locals.user.save();
    try {
      await sendMail({
        email: res.locals.user.email,
        subject: `Project ${doc.name} notifications`,
        message: `Hi ${res.locals.user.name}, you have just created a new project!`,
        html: `<b>Hi ${res.locals.user.name}, you have just created a new project!<b>`,
      });
    } catch (error) {
      console.log(error);
      res.status(502).json({ error: "Lỗi gửi mail!" });
    }

    res.status(201).json({
      status: "success",
      projectName: doc.projectName,
      data: doc,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi!" });
  }
});

exports.addMember = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  let user = await User.findOne({ name: username });
  if (!user)
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy tài khoản này trong hệ thống!",
    });
  let project = await Project.findOne({
    _id: req.params.id,
    active: true,
  })
    .select("members memberQuantity admin moderators")
    .populate("members", "name email");
  if (!project)
    return res
      .status(404)
      .json({ status: "fail", message: "Không tìm thấy dự án với ID này!" });
  if (project.members.length + 1 > project.memberQuantity)
    return res.status(400).json({ status: "fail", message: "Dự án đã đầy!" });
  if (
    project.members.indexOf(user.id) != -1 ||
    user.myProjects.indexOf(project.id) != -1
  )
    return res.status(400).json({
      status: "fail",
      message: "Tài khoản này đã được thêm vào dự án!",
    });
  const isModerator = () => {
    var found = false;
    for (var i = 0; i < project.moderators.length; i++) {
      if (
        project.moderators[i]._id.toString() == res.locals.user._id.toString()
      ) {
        found = true;
        break;
      }
    }
    return found;
  };
  if (
    project.admin.toString() !== res.locals.user._id.toString() &&
    !isModerator()
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Tài khoản này không có quyền thêm thành viên vào dự án!",
    });
  } else {
    project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        members: { $ne: user._id },
      },
      {
        $addToSet: {
          members: user._id,
        },
      },
      { new: true, upsert: false }
    );

    await User.findOneAndUpdate(
      {
        name: username,
        myProjects: { $ne: project._id },
      },
      {
        $addToSet: { myProjects: project._id },
      },
      {
        new: true,
        upsert: false,
      }
    );
  }
  project = await Project.findById(req.params.id)
    .select("members name")
    .populate("members", "name email");
  await HistoryLog.create({
    time: date(),
    message: `Tài khoản ${user.name} được thêm vào dự án bởi ${res.locals.user.name}`,
    project: project._id,
  });
  const noti = await Notification.create({
    time: date(),
    description: `Tài khoản ${user.name} được thêm vào dự án bởi ${res.locals.user.name}`,
    actorName: project.name,
    project: project._id,
  });
  let promiseArr = [];
  const mailTo = async (member) => {
    try {
      await sendMail({
        email: member.email,
        subject: `Project ${project.name} notifications`,
        html: `<b>${member.name} has just been added to ${project.name} by ${res.locals.user.name}`,
      });
      await User.findByIdAndUpdate(member.id, {
        $push: { notifications: noti._id },
      });
    } catch (error) {
      res.status(502).json({ error: "Lỗi gửi mail!" });
    }
  };
  project.members.forEach((member) => {
    if (member.id != res.locals.user.id) {
      promiseArr.push(mailTo(member));
    }
  });
  await Promise.all(promiseArr);
  res.status(200).json({
    status: "success",
    data: project,
  });
});
exports.removeMember = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  let user = await User.findOne({ name: username })
    .populate({
      path: "assignedSubTasks",
      select: "task",
      populate: { path: "task", select: "project" },
    })
    .populate("watchTasks", "project");
  if (!user)
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy tài khoản này trong hệ thống!",
    });
  let project = await Project.findOne({
    _id: req.params.id,
    active: true,
  })
    .select("members projectTasks memberQuantity admin moderators")
    .populate({ path: "projectTasks", populate: "subTasks" });
  if (!project)
    return res
      .status(404)
      .json({ status: "fail", message: "Không tìm thấy dự án với ID này!" });
  const checkAssignedSubTasks = (arraySubTasks) => {
    var found = false;
    for (var i = 0; i < arraySubTasks.length; i++) {
      if (arraySubTasks[i].task.project == project._id.toString()) {
        found = true;
        break;
      }
    }
    return found;
  };
  const checkWatchTasks = (arrayWatchTasks) => {
    var found = false;
    for (var i = 0; i < arrayWatchTasks.length; i++) {
      if (arrayWatchTasks[i].project == project._id.toString()) {
        found = true;
        break;
      }
    }
    return found;
  };
  if (!project.members.includes(user._id))
    return res
      .status(400)
      .json({ status: "fail", message: "Tài khoản không nằm trong dự án!" });
  if (checkAssignedSubTasks(user.assignedSubTasks)) {
    return res.status(400).json({
      status: "fail",
      message:
        "Thành viên này vẫn còn được phân công SubTask! Vui lòng chọn người phân công khác trước khi xóa thành viên!",
    });
  }
  if (checkWatchTasks(user.watchTasks)) {
    return res.status(400).json({
      status: "fail",
      message:
        "Thành viên này vẫn còn được phân công giám sát Task! Vui lòng chọn người giám sát khác trước khi xóa thành viên!",
    });
  }
  if (project.admin.toString() === user._id.toString()) {
    return res.status(400).json({
      status: "fail",
      message: "Không thể xóa Admin ra khỏi dự án!",
    });
  }
  if (res.locals.user._id.toString() === user._id.toString()) {
    return res.status(400).json({
      status: "fail",
      message:
        "Không thể tự xóa chính mình ra khỏi dự án! Vui lòng liên hệ quản lý dự án!",
    });
  }
  const isModerator = () => {
    var found = false;
    for (var i = 0; i < project.moderators.length; i++) {
      if (
        project.moderators[i]._id.toString() == res.locals.user._id.toString()
      ) {
        found = true;
        break;
      }
    }
    return found;
  };
  if (
    project.admin.toString() !== res.locals.user._id.toString() &&
    !isModerator()
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Tài khoản này không có quyền xóa thành viên khỏi dự án!",
    });
  } else {
    await Project.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          members: user._id,
        },
        $pull: {
          moderators: user._id,
        },
      },
      { new: true, upsert: false }
    );

    user = await User.findOneAndUpdate(
      {
        name: username,
      },
      {
        $pull: { myProjects: project._id },
      },
      {
        new: true,
        upsert: false,
      }
    );
  }
  project = await Project.findById(req.params.id)
    .select("members name")
    .populate("members", "name email");

  await HistoryLog.create({
    time: date(),
    message: `Tài khoản ${username} được mời ra khỏi dự án bởi ${res.locals.user.name}`,
    project: project._id,
  });
  const noti = await Notification.create({
    time: date(),
    description: `Tài khoản ${username} được mời ra khỏi dự án bởi ${res.locals.user.name}`,
    actorName: project.name,
    project: project._id,
  });
  let promiseArr = [];
  const mailTo = async (member) => {
    try {
      await sendMail({
        email: member.email,
        subject: `Project ${project.name} notifications`,
        html: `<b>${member.name} has just been removed from ${project.name} by ${res.locals.user.name}`,
      });
      await User.findByIdAndUpdate(member.id, {
        $push: { notifications: noti._id },
      });
    } catch (error) {
      res.status(502).json({ error: "Lỗi gửi mail!" });
    }
  };
  project.members.forEach((member) => {
    if (member.id != res.locals.user.id) promiseArr.push(mailTo(member));
  });
  await Promise.all(promiseArr);
  res.status(200).json({
    status: "success",
    data: project,
  });
});
// const pullOutProject = async (userId, projectId) => {
//   await User.findByIdAndUpdate(userId, {
//     $pull: {
//       myProjects: projectId,
//     },
//   });
// };
// const pullOutWatch = async (taskId) => {
//   await User.updateMany(
//     { watchTasks: { $in: taskId } },
//     {
//       $pull: {
//         watchTasks: taskId,
//       },
//     }
//   );
// };
// const pullOutSubTask = async (subTaskId) => {
//   await User.updateMany(
//     { assignedSubTask: { $in: subTaskId } },
//     {
//       $pull: {
//         assignedSubTask: subTaskId,
//       },
//     }
//   );
// };
// const deleteAllSubTasks = async (taskId) => {
//   const subTasks = await SubTask.find({ task: taskId });
//   const subTasksPromiseArr = [];
//   subTasks.map((subTaskId) => {
//     subTasksPromiseArr.push(pullOutSubTask(subTaskId));
//   });
//   await Promise.all(subTasksPromiseArr);
//   await SubTask.deleteMany({ task: taskId });
// };

// exports.deleteProject = catchAsync(async (req, res, next) => {
//   let tempProject = await Project.findById(req.params.id);
//   if (!tempProject) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Không tìm thấy dự án đang hoạt động với ID này!",
//     });
//   }
//   if (res.locals.user._id.toString() === tempProject.admin.toString()) {
//     let usersPromiseArr = [];
//     let tasksPromiseArr = [];
//     let watchsPromiseArr = [];

//     tempProject.members.map((userId) => {
//       usersPromiseArr.push(pullOutProject(userId, req.params.id));
//     });

//     tempProject.projectTasks.map((taskId) => {
//       tasksPromiseArr.push(deleteAllSubTasks(taskId));
//       watchsPromiseArr.push(pullOutWatch(taskId));
//     });
//     await Promise.all(usersPromiseArr);
//     await Promise.all(tasksPromiseArr);
//     await Promise.all(watchsPromiseArr);
//     await Task.deleteMany({ project: req.params.id });
//     await Project.findByIdAndRemove(req.params.id);

//     return res.status(200).json({
//       status: "success",
//       data: null,
//     });
//   } else {
//     return res.status(403).json({
//       status: "fail",
//       message: "Bạn không thể xóa dự án này!",
//     });
//   }
// });
exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    active: true,
  }).populate("members", "name email");

  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy dự án đang hoạt động với ID này!",
    });
  }
  if (res.locals.user._id.toString() != project.admin.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Bạn không thể cập nhật dự án này!",
    });
  }
  await HistoryLog.create({
    time: date(),
    message: `Thông tin dự án được cập nhật bởi ${res.locals.user.name}`,
    project: project._id,
  });
  const noti = await Notification.create({
    time: date(),
    description: `Thông tin dự án được cập nhật bởi ${res.locals.user.name}`,
    actorName: project.name,
    project: project._id,
  });
  let promiseArr = [];
  const mailTo = async (member) => {
    try {
      await sendMail({
        email: member.email,
        subject: `Project ${project.name} notifications`,
        html: `<b>${project.name} has been updated by ${res.locals.user.name}`,
      });
      await User.findByIdAndUpdate(member.id, {
        $push: { notifications: noti._id },
      });
    } catch (error) {
      res.status(502).json({ error: "Lỗi gửi mail!" });
    }
  };
  project.members.forEach((member) => {
    promiseArr.push(mailTo(member));
  });
  await Project.findByIdAndUpdate(req.params.id, {
    ...req.body,
  });

  res.status(200).json({
    status: "success",
    data: project,
  });
});
exports.archiveProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    archived: false,
    active: false,
  }).populate("members", "name email");
  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy dự án đã đóng với ID này!",
    });
  }
  if (
    res.locals.user._id.toString() != project.admin.toString() ||
    !res.locals.isPremium
  ) {
    return res.status(403).json({
      status: "fail",
      message: "Bạn không thể lưu trữ dự án này!",
    });
  }
  await HistoryLog.create({
    time: date(),
    message: `Dự án đã được lưu trữ bởi ${res.locals.user.name}`,
    project: project._id,
  });
  const noti = await Notification.create({
    time: date(),
    description: `Dự án đã được lưu trữ bởi ${res.locals.user.name}`,
    actorName: project.name,
    project: project._id,
  });
  let promiseArr = [];
  const mailTo = async (member) => {
    try {
      await sendMail({
        email: member.email,
        subject: `Project ${project.name} notifications`,
        html: `<b>${project.name} has been archived by ${res.locals.user.name}`,
      });
      await User.findByIdAndUpdate(member.id, {
        $push: { notifications: noti._id },
      });
    } catch (error) {
      res.status(502).json({ error: "Lỗi gửi mail!" });
    }
  };
  project.members.forEach((member) => {
    promiseArr.push(mailTo(member));
  });
  await Project.findByIdAndUpdate(req.params.id, {
    archived: true,
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});
exports.closeProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    active: true,
  }).populate("members", "name email");
  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy dự án đang hoạt động với ID này!",
    });
  }
  if (res.locals.user._id.toString() != project.admin.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Bạn không thể đóng dự án này!",
    });
  }
  await HistoryLog.create({
    time: date(),
    message: `Dự án đã đóng bởi ${res.locals.user.name}`,
    project: project._id,
  });
  const noti = await Notification.create({
    time: date(),
    description: `Dự án đã đóng bởi ${res.locals.user.name}`,
    actorName: project.name,
    project: project._id,
  });
  let promiseArr = [];
  const mailTo = async (member) => {
    try {
      await sendMail({
        email: member.email,
        subject: `Project ${project.name} notifications`,
        html: `<b>${project.name} has been closed by ${res.locals.user.name}`,
      });
      await User.findByIdAndUpdate(member.id, {
        $push: { notifications: noti._id },
      });
    } catch (error) {
      res.status(502).json({ error: "Lỗi gửi mail!" });
    }
  };
  project.members.forEach((member) => {
    promiseArr.push(mailTo(member));
  });
  await Project.findByIdAndUpdate(req.params.id, {
    active: false,
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.grantAuthority = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    active: true,
  }).populate("members", "name email");
  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy dự án đang hoạt động với ID này!",
    });
  }
  if (res.locals.user._id.toString() != project.admin.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Bạn không thể ủy quyền thành viên khác trong dự án này!",
    });
  }
  const moderators = await User.find({
    _id: { $in: req.body.moderators },
    myProjects: { $in: req.params.id },
  });
  let promiseArr = [];
  if (moderators.length > 0) {
    moderators.forEach((data) => {
      promiseArr.push(async () => {
        await HistoryLog.create({
          time: date(),
          message: `Tài khoản ${data.name} được ủy quyền bởi ${res.locals.user.name}`,
          project: project._id,
        });
      });
    });
    await Promise.all(promiseArr);
  } else {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy các tài khoản này trong dự án!",
    });
  }

  let promiseArr2nd = [];
  const mailTo = async (member) => {
    try {
      await sendMail({
        email: member.email,
        subject: `Project ${project.name} notifications`,
        html: `<b>${member.name} has been granted moderator by ${res.locals.user.name}`,
      });
      const noti = await Notification.create({
        time: date(),
        description: `Tài khoản ${member.name} được ủy quyền bởi ${res.locals.user.name}`,
        actorName: project.name,
        project: project._id,
      });
      await User.findByIdAndUpdate(member.id, {
        $push: { notifications: noti._id },
      });
    } catch (error) {
      res.status(502).json({ error: "Lỗi gửi mail!" });
    }
  };
  project.members.forEach((member) => {
    promiseArr2nd.push(mailTo(member));
  });
  await Project.findByIdAndUpdate(req.params.id, {
    $addToSet: { moderators: req.body.moderators },
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});
exports.removeAuthority = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    active: true,
  }).populate("members", "name email");
  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy dự án đang hoạt động với ID này!",
    });
  }
  if (res.locals.user._id.toString() != project.admin.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Bạn không thể xóa quyền thành viên khác trong dự án này!",
    });
  }
  if (!project.moderators.includes(req.body.moderatorId))
    return res.status(404).json({
      status: "fail",
      message:
        "Không tìm thấy các tài khoản này với vai trò là mod trong dự án!",
    });

  let promiseArr2nd = [];
  const mailTo = async (member) => {
    try {
      await sendMail({
        email: member.email,
        subject: `Project ${project.name} notifications`,
        html: `<b>${member.name} has been ungranted moderator by ${res.locals.user.name}`,
      });
      const noti = await Notification.create({
        time: date(),
        description: `Tài khoản ${member.name} bị xóa quyền bởi ${res.locals.user.name}`,
        actorName: project.name,
        project: project._id,
      });
      await User.findByIdAndUpdate(member.id, {
        $push: { notifications: noti._id },
      });
    } catch (error) {
      res.status(502).json({ error: "Lỗi gửi mail!" });
    }
  };
  project.members.forEach((member) => {
    promiseArr2nd.push(mailTo(member));
  });
  await Project.findByIdAndUpdate(req.params.id, {
    $pull: { moderators: req.body.moderatorId },
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getProject = factory.getOne(
  Project,
  "projectTasks members moderators admin",
  "subTasks watchers watchTasks assignedSubTasks",
  "assignee task"
);
exports.getAllProjects = factory.getAll(Project);
exports.getAllBanners = factory.getAll(Banner);
exports.getProjectLog = catchAsync(async (req, res, next) => {
  try {
    const doc = await HistoryLog.find({ project: req.params.id });

    if (!doc) {
      return res.status(400).json({
        status: "fail",
        message: "Dự án không có lịch sử!",
      });
    }

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    console.log(error);
  }
});
