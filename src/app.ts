import express from "express";
import eventRouter from "./routes/events";

const app = express();
const port = 8000;

app.use("/api/v1/events", eventRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
