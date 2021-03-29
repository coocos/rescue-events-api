import knex from "knex";
import config from "../config";
import logger from "../logger";

import { RescueEvent } from "../types";

export type EventService = {
  findAll(): Promise<RescueEvent[]>;
  exists(event: RescueEvent): Promise<boolean>;
  add(event: RescueEvent): Promise<void>;
};

export const sqlEventService: EventService = (() => {
  type Location = {
    id: number;
    name: string;
  };
  type Type = {
    id: number;
    name: string;
  };
  type Event = {
    id: number;
    location_id: number;
    type_id: number;
    time: Date;
    hash: string;
  };

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
        .select<RescueEvent[]>(
          "events.time",
          "events.hash",
          "locations.name as location",
          "types.name as type"
        );
      return events;
    },
    async exists(event: RescueEvent): Promise<boolean> {
      const knownEvent = await db<Event>("events")
        .select("*")
        .where({ hash: event.hash })
        .first();
      return knownEvent !== undefined;
    },
    async add(event: RescueEvent): Promise<void> {
      try {
        return await db.transaction(async (trx) => {
          const knownEvent = await trx<Event>("events")
            .select("*")
            .where({
              hash: event.hash,
            })
            .first();
          if (knownEvent !== undefined) {
            return;
          }
          let location = await trx<Location>("locations")
            .select("*")
            .where({
              name: event.location,
            })
            .first();
          if (location === undefined) {
            [location] = await trx("locations")
              .insert({
                name: event.location,
              })
              .returning<Location[]>("*");
          }
          let type = await trx<Type>("types")
            .select("*")
            .where({
              name: event.type,
            })
            .first();
          if (type === undefined) {
            [type] = await trx("types")
              .insert({
                name: event.type,
              })
              .returning<Type[]>("*");
          }
          await trx("events").insert({
            type_id: type.id,
            location_id: location.id,
            time: event.time,
            hash: event.hash,
          });
        });
      } catch (error) {
        logger.error(error);
      }
    },
  };
})();
