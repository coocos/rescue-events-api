import app from "../app";
import request from "supertest";

describe("/events", () => {
  it("returns list of events", async () => {
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
