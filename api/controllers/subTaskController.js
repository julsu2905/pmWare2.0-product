const date = require("dayjs");
const catchAsync = require("../utils/catchAsync");
const sendMail = require("./../utils/email");
const factory = require("./handlerFactory");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const SubTask = require("../models/subTaskModel");
const Project = require("../models/projectModel");
const Notification = require("../models/notificationModel");
const HistoryLog = require("../models/historyLogModel");

exports.patchingSubTask = catchAsync(async (req, res, next) => {
  if (req.body.action === "changeAssign") {
    const project = await Project.findById(req.body.projectId).populate(
      "members",
      "email name"
    );
    const subTask = await SubTask.findById(req.params.id);
    if (!subTask) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy công việc có ID này!",
      });
    }
    const newAssignee = await User.findOne({
      _id: req.body.assignee,
      myProjects: { $in: req.body.projectId },
    });
    if (!newAssignee) {
      return res.status(404).json({
        status: "fail",
        message: "Người được phân công không nằm trong dự án!",
      });
    }
    if (
      res.locals.user._id.toString() != project.admin.toString() &&
      !project.moderators.includes(res.locals.user._id)
    )
      return res.status(403).json({
        status: "fail",
        message: "Bạn không thể đổi người phân công cho công việc này!",
      });
    const oldAssignee = await User.findByIdAndUpdate(subTask.assignee, {
      $pull: {
        assignedSubTasks: req.params.id,
      },
    });
    await User.findByIdAndUpdate(req.body.assignee, {
      $push: {
        assignedSubTasks: req.params.id,
      },
    });
    await HistoryLog.create({
      time: date(),
      message: `Công việc nhỏ ${subTask.name} với mã ${subTask.code} được phân công cho ${oldAssignee.name} đã được phân công cho ${newAssignee.name} bởi ${res.locals.user.name}`,
      project: req.body.projectId,
    });
    const noti = await Notification.create({
      time: date(),
      description: `Công việc nhỏ ${subTask.name} với mã ${subTask.code} được phân công cho ${oldAssignee.name} đã được phân công cho ${newAssignee.name} bởi ${res.locals.user.name}`,
      actorName: project.name,
      project: project._id,
    });

    const promiseArr = [];
    const mailTo = async (member) => {
      try {
        await sendMail({
          email: member.email,
          subject: `Project ${project.name} notifications`,
          html: `<b>Subtask ${subTask.name} with code ${subTask.code} has been re-assigned to ${newAssignee.name} by ${res.locals.user.name}`,
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
    const doc = await SubTask.findByIdAndUpdate(req.params.id, {
      assignee: req.body.assignee,
    });

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } else {
    const subTask = await SubTask.findById(req.params.id);
    const project = await Project.findById(req.body.projectId).populate(
      "members",
      "email name"
    );
    if (
      res.locals.user._id.toString() == subTask.assignee.toString() ||
      res.locals.user._id.toString() == project.admin.toString() ||
      project.members.includes(res.locals.user._id) ||
      project.moderators.includes(res.locals.user._id)
    ) {
      await HistoryLog.create({
        time: date(),
        message: `Công việc nhỏ ${subTask.name} với mã ${subTask.code} đã cập nhật trạng thái bởi ${res.locals.user.name}`,
        project: req.body.projectId,
      });
      const noti = await Notification.create({
        time: date(),
        description: `Công việc nhỏ ${subTask.name} với mã ${subTask.code} đã cập nhật trạng thái bởi ${res.locals.user.name}`,
        actorName: project.name,
        project: project._id,
      });

      const promiseArr = [];
      const mailTo = async (member) => {
        try {
          await sendMail({
            email: member.email,
            subject: `Project ${project.name} notifications`,
            html: `<b>Subtask ${subTask.name} with code ${subTask.code} has been updated its status by ${res.locals.user.name}`,
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
      const doc = await SubTask.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
      });
      res.status(201).json({
        status: "success",
        data: doc,
      });
    } else
      return res.status(403).json({
        status: "fail",
        message: "Bạn không thể cập nhật trạng thái công việc này!",
      });
  }
});
exports.deleteSubTask = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.body.projectId).populate(
    "members",
    "name email"
  );
  const subTask = await SubTask.findById(req.params.id);
  if (!subTask) {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy công việc với ID này!",
    });
  }
  if (
    res.locals.user._id.toString() != project.admin.toString() &&
    !project.moderators.includes(res.locals.user._id)
  )
    return res.status(403).json({
      status: "fail",
      message: "Bạn không thể xóa công việc này!",
    });
  else {
    await User.findByIdAndUpdate(subTask.assignee, {
      $pull: {
        assignedSubTasks: subTask._id,
      },
    });
    await Task.findByIdAndUpdate(subTask.task, {
      $pull: {
        subTasks: subTask._id,
      },
    });
    await HistoryLog.create({
      time: date(),
      message: `Công việc nhỏ ${subTask.name} với mã ${subTask.code} đã bị xóa bởi ${res.locals.user.name}`,
      project: req.body.projectId,
    });
    const noti = await Notification.create({
      time: date(),
      description: `Công việc nhỏ ${subTask.name} với mã ${subTask.code} đã bị xóa bởi ${res.locals.user.name}`,
      actorName: project.name,
      project: project._id,
    });

    const promiseArr = [];
    const mailTo = async (member) => {
      try {
        await sendMail({
          email: member.email,
          subject: `Project ${project.name} notifications`,
          html: `<b>Subtask ${subTask.name} with code ${subTask.code} has been deleted by ${res.locals.user.name}`,
        });
        await User.findByIdAndUpdate(member._id, {
          $push: { notifications: noti._id },
        });
      } catch (error) {
        console.log(error);
        res.status(502).json({ error: "Lỗi gửi mail!" });
      }
    };
    project.members.forEach((member) => {
      promiseArr.push(mailTo(member));
    });
    await SubTask.findByIdAndRemove(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        data: null,
      },
    });
  }
});
exports.updateSubTask = catchAsync(async (req, res, next) => {
  try {
    const project = await Project.findById(req.body.projectId).populate(
      "members",
      "name email"
    );
    const subTask = await SubTask.findById(req.params.id);
    if (!subTask) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy công việc với ID này!",
      });
    }

    if (subTask.assignee.toString() != req.body.subTask.assignee.toString()) {
      return res.status(400).json({
        status: "fail",
        message:
          "Bạn không thể đổi người phân công tại đây! Vui lòng chọn đổi phân công tại trang Dự án",
      });
    }
    if (
      res.locals.user._id.toString() != project.admin.toString() &&
      !project.moderators.includes(res.locals.user._id) &&
      res.locals.user._id.toString() != subTask.assignee.toString()
    )
      return res.status(403).json({
        status: "fail",
        message: "Bạn không thể cập nhật công việc này!",
      });
    else {
      await HistoryLog.create({
        time: date(),
        message: `Công việc nhỏ ${subTask.name} với mã ${subTask.code} đã được cập nhật thông tin bởi ${res.locals.user.name}`,
        project: req.body.projectId,
      });
      const noti = await Notification.create({
        time: date(),
        description: `Công việc nhỏ ${subTask.name} với mã ${subTask.code} đã được cập nhật thông tin bởi ${res.locals.user.name}`,
        actorName: project.name,
        project: project._id,
      });

      const promiseArr = [];
      const mailTo = async (member) => {
        try {
          await sendMail({
            email: member.email,
            subject: `Project ${project.name} notifications`,
            html: `<b>Task ${subTask.name} with code ${subTask.code} has been updated by ${res.locals.user.name}`,
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
      const doc = await SubTask.findByIdAndUpdate(req.params.id, {
        ...req.body.subTask,
      });
      res.status(201).json({
        status: "success",
        doc,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

exports.getSubTask = factory.getOne(SubTask, "assignee");
