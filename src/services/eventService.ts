import { RescueEvent } from "../types";

const events: {
  [hash: string]: RescueEvent;
} = {};

const eventService = {
  async findAll(): Promise<RescueEvent[]> {
    return Object.values(events);
  },
  async add(event: RescueEvent): Promise<void> {
    if (!(event.hash in events)) {
      events[event.hash] = { ...event };
    }
  },
};

export default eventService;
