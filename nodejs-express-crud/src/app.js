require("dotenv").config();

const PORT = process.env.PORT || 3000;
const ORIGINS = process.env.ORIGINS;
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const modules = require("./modules");
const ENV = process.env.ENV;
const fileUpload = require("express-fileupload");
const moment = require("moment");
const { ApplicationError } = require("./helper")("errorHandler");
const { Errorlogger } = require("./helper/logger");

// CORS
if (ENV === "DEV") {
  app.use(cors());
} else {
  app.use(
    cors({
      origin: ORIGINS.split(","),
    })
  );
}

// Load Middleware
// app.disable("x-powered-by");
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
// app.use(fileUpload());
app.use(express.static('upload'))
app.use((req, res, next) => {
  req.request_time = new Date().getTime();
  next();
});


// Application Info
app.all("/", (req, res) => {
  let response = { status: 0, message: `Web Service`, data: null };
  res.send(response);
});

// Regist modules
Object.keys(modules).forEach((controller) => {
  // let pathURI = controller.replace('Controller','')
  // app.use('/'+pathURI, modules[controller]);
  app.use(modules[controller]);
});

/** Not found handler */
app.use((req, res, next) => {
  let err = new ApplicationError("URL Not Found");
  err.status = 404;

  next(err);
});

//Global Error Handler
app.use((err, req, res, next) => {
  let response = {
    status: err.status,
    message: err.message,
    data: null,
  };

  let reqData = JSON.stringify(req.body || req.query);
  let resData = JSON.stringify(response);

  let logTime = {
    request_time: moment(req.request_time).format("hh:mm:ss"),
    response_time: moment().format("hh:mm:ss"),
  };

  let time = JSON.stringify(logTime);

  Errorlogger(
    req.method,
    req.originalUrl,
    reqData,
    resData,
    req.connection.remoteAddress,
    time
  );

  return res.status(err.httpCode).send(response);
});

server.listen(PORT, () => console.log(`Server Up & Running on port ${PORT}`));

module.exports = server;
