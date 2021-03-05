import app from "./app";
import cron from "node-cron";
import config from "./config";
import logger from "./logger";

import * as eventRepo from "./repos/eventRepo";
import * as feed from "./feed";

cron.schedule("* * * * *", async () => {
  logger.info("Checking feed for new events...");
  const rawFeed = await feed.decodeFeed();
  const events = await feed.mapFeedToEvents(rawFeed);
  for (const event of events) {
    eventRepo.add(event);
  }
});

app.listen(config.port, () => {
  logger.info(`Running in ${config.env} mode`);
  logger.info(`Listening at http://localhost:${config.port}`);
});
