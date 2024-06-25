import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getReport } from "../controllers/report.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getReport);

export default router;