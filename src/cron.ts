import EventEmitter from "events";
import cron from "node-cron";
import logger from "./logger";

import { eventService, feedService } from "./services";

// TODO: Figure out a good way to test this
const feedScraper = (): EventEmitter => {
  const feedEventEmitter = new EventEmitter();
  cron.schedule("* * * * *", async () => {
    const rawFeed = await feedService.decodeFeed();
    const events = await feedService.mapFeedToEvents(rawFeed);
    for (const event of events) {
      if (await eventService.add(event)) {
        logger.info("New event: %s", event);
        feedEventEmitter.emit("rescueEvent", event);
      }
    }
  });
  return feedEventEmitter;
};

export default feedScraper;
