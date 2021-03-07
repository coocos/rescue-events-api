import app from "./app";
import cron from "node-cron";
import config from "./config";
import logger from "./logger";

import { eventService, feedService } from "./services";

cron.schedule("* * * * *", async () => {
  logger.info("Checking feed for new events...");
  const rawFeed = await feedService.decodeFeed();
  const events = await feedService.mapFeedToEvents(rawFeed);
  for (const event of events) {
    eventService.add(event);
  }
});

app.listen(config.port, () => {
  logger.info(`Running in ${config.env} mode`);
  logger.info(`Listening at http://localhost:${config.port}`);
});
