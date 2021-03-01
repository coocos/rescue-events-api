import { Request, Response } from "express";
import * as EventRepo from "../repos/eventRepo";

export async function listEvents(req: Request, res: Response): Promise<void> {
  const events = await EventRepo.findAll();
  res.json(
    events.map(({ type, location, time }) => ({
      type,
      location,
      time: time.toISOString(),
    }))
  );
}
