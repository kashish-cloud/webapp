const { createLogger, format, transports } = require("winston");
const path = require("path");

const logFilePath = path.join("/var", "log", "webapp", "application.log");

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: logFilePath }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => {
          const { timestamp, level, message, ...meta } = info;
          return `${timestamp} [${log.severity.toUpperCase()}]: ${log.message}`;
        })
      ),
    }),
  ],
});

module.exports = logger;
