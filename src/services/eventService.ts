import knex from "knex";
import config from "../config";
import logger from "../logger";

import { RescueEvent } from "../types";

type EventService = {
  findAll(): Promise<RescueEvent[]>;
  add(event: RescueEvent): Promise<boolean>;
};

const inMemoryEventService: EventService = (() => {
  const events: {
    [hash: string]: RescueEvent;
  } = {};
  return {
    async findAll(): Promise<RescueEvent[]> {
      return Object.values(events);
    },
    async add(event: RescueEvent): Promise<boolean> {
      if (event.hash in events) {
        return false;
      }
      events[event.hash] = { ...event };
      return true;
    },
  };
})();

const sqlEventService: EventService = (() => {
  const db = knex({
    client: "postgres",
    connection: {
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
    },
  });
  return {
    async findAll(): Promise<RescueEvent[]> {
      const events = await db("events")
        .join("types", "types.id", "events.type_id")
        .join("locations", "locations.id", "events.location_id")
        .select(
          "events.time",
          "events.hash",
          "locations.name as location",
          "types.name as type"
        );
      return events;
    },
    async add(event: RescueEvent): Promise<boolean> {
      try {
        return await db.transaction(async (trx) => {
          const knownEvent = await trx("events")
            .select("id")
            .where({
              hash: event.hash,
            })
            .first();
          if (knownEvent !== undefined) {
            return false;
          }
          let location = await trx("locations")
            .select("id")
            .where({
              name: event.location,
            })
            .first();
          if (location === undefined) {
            location = await trx("locations").returning("id").insert({
              name: event.location,
            });
          }
          let type = await trx("types")
            .select("id")
            .where({
              name: event.type,
            })
            .first();
          if (type === undefined) {
            type = await trx("types").returning("id").insert({
              name: event.type,
            });
          }
          await trx("events").insert({
            type_id: type.id,
            location_id: location.id,
            time: event.time,
            hash: event.hash,
          });
          return true;
        });
      } catch (error) {
        logger.error(error);
        return false;
      }
    },
  };
})();

export default sqlEventService;
