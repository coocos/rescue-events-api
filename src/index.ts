import http from "http";
import process from "process";

import db from "./db";
import logger from "./logger";
import { startServer } from "./server";

function shutdown(server: http.Server): void {
  logger.info("Shutting down");
  server.close(() => {
    db.destroy();
    process.exit(1);
  });
}

const server = startServer();
process.on("SIGINT", () => shutdown(server));
process.on("SIGTERM", () => shutdown(server));
