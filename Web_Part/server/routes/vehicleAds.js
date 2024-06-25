import express from "express";
import { getVehicleAds, getUserVehicleAds, getVehicleAd, delVehicleAd, setVehicleStatus, getVehicleAdsAll, incViews, soldVehicleAd } from "../controllers/vehicleAds.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getVehicleAds);
router.get("/all", getVehicleAdsAll);
router.get("/:vehicleAdId", getVehicleAd)
router.get("/:userId/ads", getUserVehicleAds);
router.get("/sold/:vehicleAdId", soldVehicleAd);

/* UPDATE */
// router.patch("/:id/like", verifyToken, likeVehicleAd);
router.patch("/status/:vehicleAdId", setVehicleStatus)
router.patch("/views/:vehicleAdId", incViews);

/* DELETE */
router.delete("/:vehicleAdId", delVehicleAd);

export default router;
