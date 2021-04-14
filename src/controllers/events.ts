import express from "express";
import { query, validationResult, ValidationChain } from "express-validator";
import logger from "../logger";
import { events } from "../services/events";

export function validateListFilters(): ValidationChain[] {
  return [
    query("location")
      .isString()
      .notEmpty()
      .withMessage("location cannot be empty")
      .optional(),
    query(["start", "end"])
      .isISO8601()
      .optional()
      .withMessage("date needs to be formatted in ISO-8601")
      .toDate(),
  ];
}

export async function listEvents(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: errors.array(),
      });
      return;
    }
    const foundEvents = await events.find(req.query);
    res.json(
      foundEvents.map(({ type, location, time }) => ({
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
