import { RescueEvent } from "../types";

const events: RescueEvent[] = [];

export async function findAll(): Promise<RescueEvent[]> {
  return [...events];
}

export async function add(event: RescueEvent): Promise<void> {
  events.push({ ...event });
}
