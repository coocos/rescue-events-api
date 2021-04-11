import { Request, Response } from "express";
import logger from "../logger";
import { events } from "../services/events";

export async function listEvents(req: Request, res: Response): Promise<void> {
  try {
    const allEvents = await events.find();
    res.json(
      allEvents.map(({ type, location, time }) => ({
        type,
        location,
        time: time.toISOString(),
      }))
    );
  } catch (err) {
    logger.error(`Failed to list events: ${err.message}`);
    res.status(500).json({
      error: "failed to list events",
    });
  }
}
