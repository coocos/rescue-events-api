import { RescueEvent, EventService } from "./eventService";

export const inMemoryEventService: EventService = (() => {
  const events: {
    [hash: string]: RescueEvent;
  } = {};
  return {
    async findAll(): Promise<RescueEvent[]> {
      return Object.values(events);
    },
    async exists(event: RescueEvent): Promise<boolean> {
      if (event.hash in events) {
        return true;
      }
      return false;
    },
    async add(event: RescueEvent): Promise<void> {
      events[event.hash] = { ...event };
    },
  };
})();
