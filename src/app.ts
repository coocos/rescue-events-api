import express from "express";
import eventRouter from "./routes/events";
import * as loaders from "./loaders";

const app = express();
loaders.loadExpress(app);

app.use("/api/v1/events", eventRouter);

export default app;
