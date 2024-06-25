import express from "express";
import { createIssue, getIssues, deleteIssue, updateIssue } from "../controllers/issues.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getIssues);

/* CREATE */
router.post("/", createIssue);

/* UPDATE */
router.put("/", updateIssue);

/* DELETE */
router.delete("/:id", verifyToken, deleteIssue);

export default router;
