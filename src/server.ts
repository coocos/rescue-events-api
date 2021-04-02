import http from "http";

import app from "./app";
import config from "./config";
import logger from "./logger";
import listenToFeed from "./cron";
import webSocketServer from "./websocket";

export function startServer(): http.Server {
  const httpServer = app.listen(config.port, () => {
    logger.info(`Running in ${config.env} mode`);
    logger.info(`Listening at http://localhost:${config.port}`);
    logger.info(
      `Database running at ${config.database.host}:${config.database.port}`
    );
  });

  const broadcast = webSocketServer(httpServer);

  const feed = listenToFeed();
  feed.on("rescueEvent", broadcast);
  httpServer.on("close", () => {
    feed.close();
  });

  return httpServer;
}
