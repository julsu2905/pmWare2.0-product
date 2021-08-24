var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const session = require("express-session");
const AppError = require("./utils/appError");
const authenRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const adminRouter = require("./routes/admins");
const projectRouter = require("./routes/projects");
const taskRouter = require("./routes/tasks");
const priceRouter = require("./routes/prices");
const subTaskRouter = require("./routes/subTasks");
const notificationRouter = require("./routes/notifications");
const uploadRouter = require("./routes/uploads");
const swaggerUI = require("swagger-ui-express");
const docs = require("./docs");
const multer = require("multer");

const globalErrorHandler = require("./controllers/errorController");

var app = express();

const multerStoragePdf = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image") && file.fieldname === "avatar") {
      cb(null, path.join(`${__dirname}/public/img/user`));
    }
    if (file.mimetype.startsWith("image") && file.fieldname === "banner") {
      cb(null, path.join(`${__dirname}/public/img/banner`));
    }
    if (
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, path.join(`${__dirname}/public/uploads`));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith(
      "application/pdf" || "image" || "application/vnd.ms-excel"
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not an image, pdf or csv ! Please upload only images, pdf or csv.",
        400
      ),
      false
    );
  }
};
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.enable("trust proxy");
app.use(express.static(path.join(__dirname, "../userpage/build")));

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  multer({ storage: multerStoragePdf, multerFilter }).fields([
    { name: "avatar", maxCount: 1 },
    { name: "attachment", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ])
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(mongoSanitize());
const allowedDomains = [
  "http://localhost:4000",
  "http://localhost:3000",
  "http://localhost:9696",
  "https://pmware.netlify.app",
  "https://admin-pmware.netlify.app"
];
app.use(xss());
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);

      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.options("*", cors());

//ROUTES
app.use("/api", authenRouter);
app.use("/api/users", userRouter);
app.use("/api/adminUsers", adminRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/subtasks", subTaskRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/prices", priceRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));
app.get("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// error handler

app.use(globalErrorHandler);

module.exports = app;
