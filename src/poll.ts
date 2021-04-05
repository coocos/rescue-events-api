import cron from "node-cron";

import logger from "./logger";
import config from "./config";
import { sqlEventService } from "./services/sqlEventService";
import { fetchFeedEvents } from "./services/feedService";
import { RescueEvent } from "./services/eventService";

export const pollFeed = (
  eventCallback: (event: RescueEvent) => void
): cron.ScheduledTask => {
  const task = cron.schedule(config.feed.schedule, async () => {
    const events = await fetchFeedEvents();
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
