import { inMemoryEventService as eventService } from "./inMemoryEventService";

describe("EventRepo", () => {
  it("adds event to repository", async () => {
    eventService.add({
      type: "rakennuspalo: keskisuuri",
      location: "Tuusula",
      time: new Date("2021-01-31T22:00:00.000Z"),
      hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
    });
    expect(await eventService.findAll()).toEqual([
      {
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: new Date("2021-01-31T22:00:00.000Z"),
        hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
      },
    ]);
  });
  it("does not add duplicate event to repository", async () => {
    for (let i = 0; i < 2; i++) {
      eventService.add({
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: new Date("2021-01-31T22:00:00.000Z"),
        hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
      });
    }
    expect(await eventService.findAll()).toEqual([
      {
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: new Date("2021-01-31T22:00:00.000Z"),
        hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
      },
    ]);
  });
});
