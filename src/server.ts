import app from "./app";
import config from "./config";
import logger from "./logger";
import pollFeed from "./cron";

pollFeed();

app.listen(config.port, () => {
  logger.info(`Running in ${config.env} mode`);
  logger.info(`Listening at http://localhost:${config.port}`);
});
