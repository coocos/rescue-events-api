import request from "supertest";
import app from "../app";
import { events } from "../services/events";

jest.mock("../services/events");

describe("/events", () => {
  const mockEvents = events as jest.Mocked<typeof events>;
  mockEvents.find.mockResolvedValue([
    {
      location: "Kokkola",
      type: "tulipalo muu: pieni",
      time: new Date("2021-04-14T15:21:40.000Z"),
      hash: "19dbf51923807992bc11e3a7826523487cee4773",
    },
    {
      location: "Imatra",
      type: "tulipalo muu: keskisuuri",
      time: new Date("2021-04-14T15:27:01.000Z"),
      hash: "35179fd03e62ba2f063ff6e45d8d6508b868e3c8",
    },
  ]);

  it("returns all events", async () => {
    const response = await request(app).get("/api/v1/events");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        location: "Kokkola",
        type: "tulipalo muu: pieni",
        time: "2021-04-14T15:21:40.000Z",
      },
      {
        location: "Imatra",
        type: "tulipalo muu: keskisuuri",
        time: "2021-04-14T15:27:01.000Z",
      },
    ]);
    expect(mockEvents.find).toBeCalledWith({});
  });

  it("returns events for given location", async () => {
    const response = await request(app).get("/api/v1/events?location=Kokkola");
    expect(response.status).toBe(200);
    expect(mockEvents.find).toBeCalledWith({
      location: "Kokkola",
    });
  });

  it("returns events for given start time", async () => {
    const response = await request(app).get(
      "/api/v1/events?start=2021-04-14T15:27:00.000Z"
    );
    expect(response.status).toBe(200);
    expect(mockEvents.find).toBeCalledWith({
      start: new Date("2021-04-14T15:27:00.000Z"),
    });
  });

  it("returns events for given end time", async () => {
    const response = await request(app).get(
      "/api/v1/events?end=2021-04-14T15:25:00.000Z"
    );
    expect(response.status).toBe(200);
    expect(mockEvents.find).toBeCalledWith({
      end: new Date("2021-04-14T15:25:00.000Z"),
    });
  });
});
