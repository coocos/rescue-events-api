import request from "supertest";
import app from "../app";
import eventService from "../services/eventService";

describe("/events", () => {
  it("returns list of events", async () => {
    eventService.add({
      type: "rakennuspalo: keskisuuri",
      location: "Tuusula",
      time: new Date("2021-01-31T22:00:00.000Z"),
      hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
    });
    const response = await request(app).get("/api/v1/events");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: "2021-01-31T22:00:00.000Z",
      },
    ]);
  });
});
