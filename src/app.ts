import express from "express";
import eventRouter from "./routes/events";

const app = express();

app.use("/api/v1/events", eventRouter);

export default app;
