import cron from "node-cron";

import logger from "./logger";
import config from "./config";
import { sqlEventService, feedService } from "./services";
import { RescueEvent } from "./services/eventService";

export const pollFeed = (
  eventCallback: (event: RescueEvent) => void
): cron.ScheduledTask => {
  const task = cron.schedule(config.feed.schedule, async () => {
    const rawFeed = await feedService.decodeFeed();
    const events = await feedService.mapFeedToEvents(rawFeed);
    for (const event of events) {
      if (!(await sqlEventService.exists(event))) {
        logger.info("New event", event);
        await sqlEventService.add(event);
        eventCallback(event);
      }
    }
  });
  return task;
};
