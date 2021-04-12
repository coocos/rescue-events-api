import express from "express";
import { query, validationResult, ValidationChain } from "express-validator";
import logger from "../logger";
import { events } from "../services/events";

export function validateListFilters(): ValidationChain[] {
  return [query("location").isString().optional()];
}

export async function listEvents(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        error: errors.array(),
      });
      return;
    }
    const allEvents = await events.find(req.query);
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
