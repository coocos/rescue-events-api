import { RescueEvent } from "../types";

const events = [
  {
    type: "rakennuspalo: keskisuuri",
    location: "Tuusula",
    time: new Date(2021, 1, 1),
  },
];

export async function findAll(): Promise<RescueEvent[]> {
  return [...events];
}

export async function add(event: RescueEvent): Promise<void> {
  events.push({ ...event });
}
