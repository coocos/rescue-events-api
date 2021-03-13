import express from "express";
import morgan from "morgan";
import logger from "../logger";

export function loadExpress(app: express.Application): express.Application {
  app.use(
    morgan(":method :url :status :response-time ms", {
      stream: {
        write: (message) => {
          logger.info(message.trimEnd());
        },
      },
    })
  );
  return app;
}
