const date = require("dayjs");
const catchAsync = require("../utils/catchAsync");
const sendMail = require("./../utils/email");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const SubTask = require("../models/subTaskModel");
const Project = require("../models/projectModel");
const HistoryLog = require("../models/historyLogModel");
const Notification = require("../models/notificationModel");

exports.createTask = catchAsync(async (req, res, next) => {
  const { projectId } = req.body;

  const project = await Project.findById(projectId).populate(
    "members",
    "name email"
  );
  if (
    res.locals.user._id.toString() != project.admin.toString() &&
    !project.moderators.includes(res.locals.user._id)
  )
    return res.status(404).json({
      status: "fail",
      message: "Bạn không thể tạo công việc trong dự án này!",
    });
  const {
    name,
    code,
    priority,
    startDate,
    dueDate,
    description,
    attachment,
    watchers,
    prerequisiteTasks,
  } = req.body.task;
  if (!project) {
    return res.status(404).json({ status: "fail", message: "Lỗi!" });
  }
  if (date(startDate).diff(date(dueDate)) >= 0) {
    return res
      .status(400)
      .json({ status: "fail", message: "Không thể chọn ngày giờ này!" });
  }
  const checkCode = await Task.findOne({ code: code });
  if (checkCode) {
    return res
      .status(400)
      .json({ status: "fail", message: "Mã công việc này đã tồn tại!" });
  }

  let preTaskPromiseArr = [];
  if (prerequisiteTasks && prerequisiteTasks.length > 0) {
    const checkPrerequisite = async (taskId) => {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          status: "fail",
          message: "Không tìm thấy công việc với ID này!",
        });
      }
      // ngày bắt đầu của task mới phải nhỏ hơn ngày kết thúc của task tiên quyết
      if (date(task.dueDate).diff(date(startDate)) >= 0)
        return new Promise((resovle, reject) =>
          reject(
            res.status(400).json({
              status: "fail",
              message: "Không thể chọn ngày giờ này!",
            })
          )
        );
    };

    prerequisiteTasks.map((taskId) => {
      preTaskPromiseArr.push(checkPrerequisite(taskId));
    });
  }
  await Promise.all(preTaskPromiseArr);

  try {
    const doc = await Task.create({
      name,
      code,
      priority,
      startDate,
      dueDate,
      description,
      attachment,
      watchers,
      prerequisiteTasks,
      project: projectId,
    });
    const addPrerequisite = async (taskId) => {
      await Task.findByIdAndUpdate(
        doc._id,
        {
          $addToSet: {
            prerequisiteTasks: taskId,
          },
        },
        {
          new: true,
        }
      );
    };
    let addPreTaskArr = [];
    prerequisiteTasks.map((taskId) => {
      addPreTaskArr.push(addPrerequisite(taskId));
    });
    await Promise.all(addPreTaskArr);

    if (watchers && watchers.length > 0) {
      let promisesArr = [];
      const addWatchTask = async (watcherId) => {
        await User.findByIdAndUpdate(
          watcherId,
          {
            $push: {
              watchTasks: doc._id,
            },
          },
          {
            new: true,
          }
        );
      };
      watchers.map((watcherId) => {
        promisesArr.push(addWatchTask(watcherId));
      });
      await Promise.all(promisesArr);
    }
    await HistoryLog.create({
      time: date(),
      message: `Công việc ${doc.name} với mã ${doc.code} được tạo bởi ${res.locals.user.name}`,
      project: projectId,
    });
    const noti = await Notification.create({
      time: date(),
      description: `Công việc ${doc.name} với mã ${doc.code} được tạo bởi ${res.locals.user.name}`,
      actorName: project.name,
      project: project._id,
    });

    let promiseArr = [];
    const mailTo = async (member) => {
      try {
        await sendMail({
          email: member.email,
          subject: `Project ${project.name} notifications`,
          html: `<b>Task ${doc.name} with code ${doc.code} has been created by ${res.locals.user.name}`,
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
    await Project.findOneAndUpdate(
      { _id: req.body.projectId, active: true },
      {
        $push: {
          projectTasks: doc._id,
        },
      }
    );

    return res.status(201).json({
      status: "success",
      data: "doc",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "fail", message: "Không thể chọn ngày giờ này!" });
  }
});
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate(
    "assignedMember",
    "name"
  );

  res.status(201).json({
    status: "success",
    task: task,
  });
});
exports.getLatestDueDate = catchAsync(async (req, res, next) => {
  const { listTasksId } = req.body;
  const listTasksDueDate = [];
  const getDataTask = async (taskId) => {
    try {
      const getTaskRes = await Task.findById(taskId).select("dueDate");
      listTasksDueDate.push(date(getTaskRes.dueDate));
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy công việc với Id này!",
      });
    }
  };
  const promiseArr = [];
  listTasksId.forEach((id) => {
    promiseArr.push(getDataTask(id));
  });
  await Promise.all(promiseArr);
  res.status(201).json({
    status: "success",
    result: date(Math.max.apply(null, listTasksDueDate)),
  });
});
exports.createSubTask = catchAsync(async (req, res, next) => {
  const {
    code,
    name,
    description,
    assignee,
    dueDate,
    startDate,
    attachment,
    project,
  } = req.body;
  let tempProject = await Project.findById(project);
  if (
    res.locals.user._id.toString() == tempProject.admin.toString() ||
    tempProject.moderators.includes(res.locals.user._id)
  ) {
    if (date(startDate).diff(date(dueDate)) >= 0) {
      return res.status(400).json({ status: "fail", message: "Bad request!" });
    }
    if (!tempProject.members.includes(assignee)) {
      return res.status(404).json({
        status: "fail",
        message: "Người được phân công không có trong dự án này!",
      });
    }
    const doc = await SubTask.create({
      code,
      name,
      description,
      assignee,
      dueDate,
      startDate,
      attachment,
      task: req.params.id,
    });
    const user = await User.findByIdAndUpdate(assignee, {
      $push: {
        assignedSubTasks: doc._id,
      },
    });
    tempProject = await Project.findById(project).populate(
      "members",
      "name email"
    );
    await HistoryLog.create({
      time: date(),
      message: `Công việc nhỏ ${doc.name} với mã ${doc.code} được phân công cho ${user.name} được tạo bởi ${res.locals.user.name}`,
      project: project,
    });
    const noti = await Notification.create({
      time: date(),
      description: `Công việc nhỏ ${doc.name} với mã ${doc.code} được phân công cho ${user.name} được tạo bởi ${res.locals.user.name}`,
      actorName: tempProject.name,
      project: project,
    });

    let promiseArr = [];
    const mailTo = async (member) => {
      try {
        await sendMail({
          email: member.email,
          subject: `Project ${tempProject.name} notifications`,
          html: `<b>Subtask ${doc.name} with code ${doc.code} assigned to ${user.name} has been created by ${res.locals.user.name}`,
        });
        await User.findByIdAndUpdate(member.id, {
          $push: { notifications: noti._id },
        });
      } catch (error) {
        res.status(502).json({ error: "Lỗi gửi mail!" });
      }
    };
    tempProject.members.forEach((member) => {
      promiseArr.push(mailTo(member));
    });
    await Task.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        subTasks: doc._id,
      },
    });

    res.status(201).json({
      status: "success",
      data: doc,
    });
  } else
    return res.status(403).json({
      status: "fail",
      message: "Bạn không thể tạo công việc trong dự án này!",
    });
});
const pullOutSubTask = async (subTaskId) => {
  await User.updateMany(
    { assignedSubTask: { $in: subTaskId } },
    {
      $pull: {
        assignedSubTask: subTaskId,
      },
    }
  );
};
const deleteAllSubTasks = async (taskId) => {
  const subTasks = await SubTask.find({ task: taskId });
  const subTasksPromiseArr = [];
  subTasks.map((subTaskId) => {
    subTasksPromiseArr.push(pullOutSubTask(subTaskId));
  });
  await Promise.all(subTasksPromiseArr);
  await SubTask.deleteMany({ task: taskId });
};
exports.deleteTask = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.body.projectId).populate(
    "members",
    "name email"
  );
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy công việc với ID này!",
    });
  }
  if (
    res.locals.user._id.toString() != project.admin.toString() &&
    !project.moderators.includes(res.locals.user._id)
  )
    return res.status(404).json({
      status: "fail",
      message: "Bạn không thể xóa công việc này!",
    });
  else {
    await Project.findByIdAndUpdate(req.body.projectId, {
      $pull: {
        projectTasks: task._id,
      },
    });
    await User.updateMany(
      { watchTasks: { $in: task._id } },
      {
        $pull: {
          watchTasks: task.id,
        },
      }
    );
    deleteAllSubTasks(req.params.id);
    await HistoryLog.create({
      time: date(),
      message: `Công việc ${task.name} với mã ${task.code} đã bị xóa (kèm với các công việc nhỏ) bởi ${res.locals.user.name}`,
      project: project._id,
    });
    const noti = await Notification.create({
      time: date(),
      description: `Công việc ${task.name} với mã ${task.code} đã bị xóa (kèm với các công việc nhỏ) bởi ${res.locals.user.name}`,
      actorName: project.name,
      project: project._id,
    });

    let promiseArr = [];
    const mailTo = async (member) => {
      try {
        await sendMail({
          email: member.email,
          subject: `Project ${project.name} notifications`,
          html: `<b>Task ${task.name} with code ${task.code} has been deleted (with its subtask) by ${res.locals.user.name}`,
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
    await Task.findByIdAndDelete(req.params.id);

    res.status(201).json({
      status: "success",
      data: null,
    });
  }
});
exports.updateTask = catchAsync(async (req, res, next) => {
  let task = await Task.findById(req.params.id);
  const project = await Project.findById(req.body.projectId).populate(
    "members",
    "name email"
  );

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Không tìm thấy công việc với ID này!",
    });
  }

  if (
    res.locals.user._id.toString() != project.admin.toString() &&
    !project.moderators.includes(res.locals.user._id)
  ) {
    return res.status(403).json({
      status: "fail",
      message: "Bạn không thể cập nhật công việc này!",
    });
  }
  await HistoryLog.create({
    time: date(),
    message: `Công việc ${task.name} với mã ${task.code} đã được cập nhật thông tin bởi ${res.locals.user.name}`,
    project: project._id,
  });
  const noti = await Notification.create({
    time: date(),
    description: `Công việc ${task.name} với mã ${task.code} đã được cập nhật thông tin bởi ${res.locals.user.name}`,
    actorName: project.name,
    project: project._id,
  });

  let promiseArr = [];
  const pullWatchTasks = async (watcherId) => {
    await User.findByIdAndUpdate(
      watcherId,
      {
        $pull: { watchTasks: req.params.id },
      },
      { new: true }
    );
  };
  const pushWatchTasks = async (watcherId) => {
    await User.findByIdAndUpdate(
      watcherId,
      {
        $addToSet: { watchTasks: req.params.id },
      },
      { new: true }
    );
  };
  task.watchers.forEach((watcherId) => {
    promiseArr.push(pullWatchTasks(watcherId));
  });
  req.body.task.watchers.forEach((watcherId) => {
    promiseArr.push(pushWatchTasks(watcherId));
  });

  await Promise.all(promiseArr);
  let promiseArr2nd = [];
  const mailTo = async (member) => {
    try {
      await sendMail({
        email: member.email,
        subject: `Project ${project.name} notifications`,
        html: `<b>Task ${task.name} with code ${task.code} has been updated by ${res.locals.user.name}`,
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
  task = await Task.findByIdAndUpdate(req.params.id, {
    ...req.body.task,
  });

  res.status(200).json({
    status: "success",
    data: task,
  });
});
