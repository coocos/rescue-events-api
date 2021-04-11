import db from "../db";
import { events } from "./events";

describe("Service", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("adds event", async () => {
    await events.add({
      location: "Kemi",
      type: "tulipalo muu: pieni",
      time: new Date("2021-01-31T22:00:00.000Z"),
      hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
    });
    const allEvents = await events.find();
    expect(allEvents).toEqual([
      {
        location: "Kemi",
        type: "tulipalo muu: pieni",
        time: new Date("2021-01-31T22:00:00.000Z"),
        hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
      },
    ]);
  });
  it("filters events based on location", async () => {
    const newEvents = [
      {
        type: "rakennuspalo: pieni",
        location: "Helsinki",
        time: new Date("2021-03-01T15:40:52.000Z"),
        hash: "169a28a0c1979d7c105490bde4e30ce5b64418a5",
      },
      {
        location: "Kemi",
        type: "tulipalo muu: pieni",
        time: new Date("2021-01-31T22:00:00.000Z"),
        hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
      },
    ];
    for (const event of newEvents) {
      await events.add(event);
    }
    expect(await events.find({ location: "Helsinki" })).toEqual([newEvents[0]]);
    expect(await events.find({ location: "Kemi" })).toEqual([newEvents[1]]);
  });

  it("indicates if event exists", async () => {
    await events.add({
      location: "Kemi",
      type: "tulipalo muu: pieni",
      time: new Date("2021-01-31T22:00:00.000Z"),
      hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
    });
    let eventExists = await events.exists({
      location: "Kemi",
      type: "tulipalo muu: pieni",
      time: new Date("2021-01-31T22:00:00.000Z"),
      hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
    });
    expect(eventExists).toBe(true);
    eventExists = await events.exists({
      type: "rakennuspalo: pieni",
      location: "Helsinki",
      time: new Date("2021-03-01T15:40:52.000Z"),
      hash: "169a28a0c1979d7c105490bde4e30ce5b64418a5",
    });
    expect(eventExists).toBe(false);
  });
});
