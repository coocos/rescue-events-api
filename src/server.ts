import app from "./app";
import cron from "node-cron";
import config from "./config";
import logger from "./logger";

import * as loaders from "./loaders";
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

loaders.loadExpress(app);

const port = process.env.PORT ?? 8000;
app.listen(port, () => {
  logger.info(`Running in ${config.env} mode`);
  logger.warn(`Listening at http://localhost:${port}`);
});
