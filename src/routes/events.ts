import express from "express";
import * as eventController from "../controllers/eventController";

const router = express.Router();

router.get("/", eventController.listEvents);

export default router;
