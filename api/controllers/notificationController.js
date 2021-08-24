const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

exports.changeStatusNotification = catchAsync(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
        return res.status(404).json({
            status: "fail",
            message: "No document found with that ID",
        });
    }
    notification.isRead = !notification.isRead;
    await notification.save();
    res.status(200).json({
        status: "success",
        data: notification.isRead,
    });
});

exports.markAllNotifications = catchAsync(async (req, res, next) => {
    const markTrue = async (notiId) => {
        await Notification.findByIdAndUpdate(notiId, { isRead: true });
    }
    res.locals.user.notifications.forEach(notification => {
        markTrue(notification._id)
    })
    await res.locals.user.save();
    res.status(200).json({
        status: "success",
    });
});

exports.removeNotification = catchAsync(async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(
            res.locals.user._id,
            {
                $pull: { notifications: req.params.id },
            },
            { upsert: true }
        );

        res.status(200).json({
            status: "success",
        });
    } catch (error) {
        console.log(error);
    }
});
