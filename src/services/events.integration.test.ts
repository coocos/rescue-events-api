import db from "../db";
import { events } from "./events";

describe("Service", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await events.clear();
  });

  afterAll(async () => {
    await db.migrate.rollback();
    await db.destroy();
  });

  it("stores event", async () => {
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
    const [helsinki, kemi] = newEvents;
    expect(await events.find({ location: "Helsinki" })).toEqual([helsinki]);
    expect(await events.find({ location: "Kemi" })).toEqual([kemi]);
  });

  it("filters events based on start time", async () => {
    const newEvents = [
      {
        type: "rakennuspalo: pieni",
        location: "Helsinki",
        time: new Date("2021-01-01T15:40:52.000Z"),
        hash: "169a28a0c1979d7c105490bde4e30ce5b64418a5",
      },
      {
        location: "Kemi",
        type: "tulipalo muu: pieni",
        time: new Date("2021-01-02T22:00:00.000Z"),
        hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
      },
    ];
    for (const event of newEvents) {
      await events.add(event);
    }
    const [first, second] = newEvents;
    expect(await events.find({ start: first.time })).toEqual([first, second]);
    expect(await events.find({ start: second.time })).toEqual([second]);
  });

  it("filters events based on an end time", async () => {
    const newEvents = [
      {
        type: "rakennuspalo: pieni",
        location: "Helsinki",
        time: new Date("2021-01-01T15:40:52.000Z"),
        hash: "169a28a0c1979d7c105490bde4e30ce5b64418a5",
      },
      {
        location: "Kemi",
        type: "tulipalo muu: pieni",
        time: new Date("2021-01-02T22:00:00.000Z"),
        hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
      },
    ];
    for (const event of newEvents) {
      await events.add(event);
    }
    const [first, second] = newEvents;
    expect(await events.find({ end: first.time })).toEqual([first]);
    expect(await events.find({ end: second.time })).toEqual([first, second]);
  });

  it("indicates if event exists", async () => {
    await events.add({
      location: "Kemi",
      type: "tulipalo muu: pieni",
      time: new Date("2021-01-31T22:00:00.000Z"),
      hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
    });
    const eventExists = await events.exists({
      location: "Kemi",
      type: "tulipalo muu: pieni",
      time: new Date("2021-01-31T22:00:00.000Z"),
      hash: "dffab7da0d65580c2c09ee683dd8f18632fa27c1",
    });
    expect(eventExists).toBe(true);
  });

  it("indicates if event does not exist", async () => {
    const eventExists = await events.exists({
      type: "rakennuspalo: pieni",
      location: "Helsinki",
      time: new Date("2021-03-01T15:40:52.000Z"),
      hash: "169a28a0c1979d7c105490bde4e30ce5b64418a5",
    });
    expect(eventExists).toBe(false);
  });
});
