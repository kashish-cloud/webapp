const { createLogger, format, transports } = require("winston");
const { LoggingWinston } = require("@google-cloud/logging-winston");
const path = require("path");

const logFilePath = path.join("/var", "log", "webapp", "application.log");

const loggingWinston = new LoggingWinston();

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.File({ filename: logFilePath }), loggingWinston],
});

module.exports = logger;
