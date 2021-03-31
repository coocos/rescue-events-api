import EventEmitter from "events";
import cron from "node-cron";
import logger from "./logger";
import config from "./config";

import { sqlEventService, feedService } from "./services";

const feedScraper = (): EventEmitter => {
  const feedEventEmitter = new EventEmitter();
  cron.schedule(`*/${config.feed.schedule} * * * *`, async () => {
    const rawFeed = await feedService.decodeFeed();
    const events = await feedService.mapFeedToEvents(rawFeed);
    for (const event of events) {
      if (!(await sqlEventService.exists(event))) {
        await sqlEventService.add(event);
        feedEventEmitter.emit("rescueEvent", event);
        logger.info("New event", event);
      }
    }
  });
  return feedEventEmitter;
};

export default feedScraper;
