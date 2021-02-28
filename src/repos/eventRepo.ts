import { RescueEvent } from "../types";

const events = [
  {
    type: "rakennuspalo: keskisuuri",
    location: "Tuusula",
    timestamp: "2020-02-05T07:00:00",
  },
];

export async function findAll(): Promise<RescueEvent[]> {
  return [...events];
}

export async function add(event: RescueEvent): Promise<void> {
  events.push({ ...event });
}
