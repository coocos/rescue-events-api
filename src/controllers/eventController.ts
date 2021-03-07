import { Request, Response } from "express";
import { eventService } from "../services";

export async function listEvents(req: Request, res: Response): Promise<void> {
  const events = await eventService.findAll();
  res.json(
    events.map(({ type, location, time }) => ({
      type,
      location,
      time: time.toISOString(),
    }))
  );
}
