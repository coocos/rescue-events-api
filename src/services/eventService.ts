import { RescueEvent } from "../types";

const events: {
  [hash: string]: RescueEvent;
} = {};

const eventService = {
  findAll(): RescueEvent[] {
    return Object.values(events);
  },
  add(event: RescueEvent): boolean {
    if (event.hash in events) {
      return false;
    }
    events[event.hash] = { ...event };
    return true;
  },
};

export default eventService;
