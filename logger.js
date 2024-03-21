const { createLogger, format, transports } = require("winston");
const path = require("path");

const logFilePath = path.join("/var", "log", "webapp", "application.log");

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.File({ filename: logFilePath })],
});

logger.add(
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf((info) => {
        const { timestamp, level, message, ...meta } = info;
        const log = {
          severity: level === "DEFAULT" ? "INFO" : level,
          message,
          timestamp,
          ...meta,
        };
        return JSON.stringify(log);
      })
    ),
  })
);

logger.add(
  new transports.Console({
    format: format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  })
);

module.exports = logger;
