import app from "./app";
import cron from "node-cron";

import * as eventRepo from "./repos/eventRepo";
import * as feed from "./feed";

cron.schedule("* * * * *", async () => {
  console.log("Checking feed for new events...");
  const rawFeed = await feed.decodeFeed();
  const events = await feed.mapFeedToEvents(rawFeed);
  for (const event of events) {
    eventRepo.add(event);
  }
});

const port = process.env.PORT ?? 8000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
