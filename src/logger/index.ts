import config from "../config";
import winston from "winston";

export default winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      silent: config.env == "test",
    }),
  ],
});
