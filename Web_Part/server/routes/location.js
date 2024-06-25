import express from "express";
import {getCities, getAreas} from "../controllers/location.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getCities);
router.get("/:city", getAreas);

/* UPDATE */
// router.patch("/:id/like", verifyToken, likeVehicleAd);

export default router;
