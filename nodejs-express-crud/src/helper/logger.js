const { createLogger, transports, format } = require("winston");
const moment = require("moment");

customFormat = format.combine(
  format.timestamp(),
  format.printf((info) => {
    return `${moment().format(
      "YYYY-MM-DD HH:mm:ss:SSS"
    )} - [${info.level.toLocaleUpperCase()}] - ${info.message}`;
  })
);

const errorLog = createLogger({
  format: customFormat,
  level: "error",
  transports: [
    //new transports.Console(),
    new transports.File({ filename: "./log/Error.log", level: "error" }),
  ],
});

const infoLog = createLogger({
  format: customFormat,
  level: "info",
  transports: [
    //new transports.Console(),
    new transports.File({ filename: "./log/Info.log", level: "info" }),
  ],
});

const Errorlogger = (
  method,
  originalUrl,
  requestData,
  responseData,
  requestIp,
  requestTime
) => {
  errorLog.error(
    `${method} || ${originalUrl} || ${requestData} || ${responseData} || ${requestIp} || ${requestTime}`
  );
};

const infologger = (
  method,
  originalUrl,
  requestData,
  responseData,
  requestIp,
  requestTime
) => {
  infoLog.info(
    `${method} || ${originalUrl} || ${requestData} || ${responseData} || ${requestIp} || ${requestTime}`
  );
};

module.exports = { Errorlogger, infologger };
