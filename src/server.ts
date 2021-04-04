import http from "http";

import app from "./app";
import config from "./config";
import logger from "./logger";
import { pollFeed } from "./poll";
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

  const feedPoller = pollFeed(broadcast);
  httpServer.on("close", () => {
    feedPoller.destroy();
  });

  return httpServer;
}
