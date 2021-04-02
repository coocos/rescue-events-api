import express from "express";
import eventRouter from "./routes/events";
import morgan from "morgan";
import logger from "./logger";

const app = express();

app.use(
  morgan(":method :url :status :response-time ms", {
    stream: {
      write: (message) => {
        logger.info(message.trimEnd());
      },
    },
  })
);

app.use("/api/v1/events", eventRouter);

export default app;
