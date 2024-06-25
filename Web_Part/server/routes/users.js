import express from "express";
import { 
  getUser, 
  getUserFriends, 
  addRemoveFriend, 
  updateUser,
  changePassword, 
  handleBlocking,
  incrementProfileViews // Import new controller function
} from "../controllers/users.js";
import { verifyToken, verifyTokenForPasswordChange } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/blocking", handleBlocking);
router.post("/:id/incrementProfileViews", incrementProfileViews); // New route

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id/changePass", verifyTokenForPasswordChange, changePassword);

export default router;
