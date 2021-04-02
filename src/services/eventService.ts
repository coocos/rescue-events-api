export type RescueEvent = {
  type: string;
  location: string;
  time: Date;
  hash: string;
};

export type EventService = {
  findAll(): Promise<RescueEvent[]>;
  exists(event: RescueEvent): Promise<boolean>;
  add(event: RescueEvent): Promise<void>;
};
