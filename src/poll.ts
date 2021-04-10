import cron from "node-cron";

import logger from "./logger";
import config from "./config";
import { events, RescueEvent } from "./services/events";
import { fetchFeedEvents } from "./services/feed";

export const pollFeed = (
  eventCallback: (event: Omit<RescueEvent, "hash">) => void
): cron.ScheduledTask => {
  const task = cron.schedule(config.feed.schedule, async () => {
    try {
      const feedEvents = await fetchFeedEvents();
      for (const event of feedEvents) {
        if (!(await events.exists(event))) {
          logger.info("New event", event);
          await events.add(event);
          eventCallback({
            location: event.location,
            time: event.time,
            type: event.type,
          });
        }
      }
    } catch (err) {
      logger.error(`Failed to fetch feed: ${err.message}`);
    }
  });
  return task;
};
