import express from "express";
import eventRouter from "./routes/events";
import * as loaders from "./loaders";

const app = loaders.loadExpress(express());

app.use("/api/v1/events", eventRouter);

export default app;
