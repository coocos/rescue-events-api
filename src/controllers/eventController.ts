import { Request, Response } from "express";
import * as EventRepo from "../repos/eventRepo";

export async function listEvents(req: Request, res: Response): Promise<void> {
  res.json(EventRepo.find());
}
