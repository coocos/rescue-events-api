import request from "supertest";
import app from "../app";
import { events } from "../services/events";

jest.mock("../services/events");

describe("/events", () => {
  it("returns all events", async () => {
    const mockEvents = events as jest.Mocked<typeof events>;
    mockEvents.find.mockResolvedValue([
      {
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: new Date("2021-01-31T22:00:00.000Z"),
        hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
      },
    ]);
    const response = await request(app).get("/api/v1/events");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: "2021-01-31T22:00:00.000Z",
      },
    ]);
    expect(mockEvents.find).toBeCalledWith({});
  });
  it("returns events for given location", async () => {
    const mockEvents = events as jest.Mocked<typeof events>;
    mockEvents.find.mockResolvedValue([
      {
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: new Date("2021-01-31T22:00:00.000Z"),
        hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
      },
    ]);
    const response = await request(app).get("/api/v1/events?location=Tuusula");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: "2021-01-31T22:00:00.000Z",
      },
    ]);
    expect(mockEvents.find).toBeCalledWith({
      location: "Tuusula",
    });
  });
});
