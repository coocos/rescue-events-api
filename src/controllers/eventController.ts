import { Request, Response } from "express";
import logger from "../logger";
import { sqlEventService } from "../services/sqlEventService";

export async function listEvents(req: Request, res: Response): Promise<void> {
  try {
    const events = await sqlEventService.findAll();
    res.json(
      events.map(({ type, location, time }) => ({
        type,
        location,
        time: time.toISOString(),
      }))
    );
  } catch (e) {
    logger.error(`Failed to list events: ${e}`);
    res.status(500).json({
      error: "failed to list events",
    });
  }
}
