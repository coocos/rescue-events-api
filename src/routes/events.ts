import express from "express";
import * as eventController from "../controllers/events";

const router = express.Router();

router.get("/", eventController.listEvents);

export default router;
