import cron from "node-cron";
import logger from "./logger";

import { eventService, feedService } from "./services";

const pollFeed = (): void => {
  cron.schedule("* * * * *", async () => {
    logger.info("Checking feed for new events...");
    const rawFeed = await feedService.decodeFeed();
    const events = await feedService.mapFeedToEvents(rawFeed);
    for (const event of events) {
      eventService.add(event);
    }
  });
};

export default pollFeed;
