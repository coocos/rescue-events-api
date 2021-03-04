import { RescueEvent } from "../types";

const events: {
  [hash: string]: RescueEvent;
} = {};

export async function findAll(): Promise<RescueEvent[]> {
  return Object.values(events);
}

export async function add(event: RescueEvent): Promise<void> {
  if (!(event.hash in events)) {
    events[event.hash] = { ...event };
  }
}
