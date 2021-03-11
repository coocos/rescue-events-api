import winston from "winston";

export default winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level} ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
});
