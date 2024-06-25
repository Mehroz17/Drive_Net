import express from "express";
import {  } from "../controllers/events.js";
import { verifyToken } from "../middleware/auth.js";
import { getLastSevenDaysVisits, incrementVisit } from "../controllers/visits.js";

const router = express.Router();

/* READ */
router.get("/", getLastSevenDaysVisits);
router.get("/increment", incrementVisit)

export default router;
