import express from "express";
import {
  checkAuth,
  login,
  logout,
  resetPassword,
  sendCode,
  sendEmail,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-email", sendEmail);
router.post("/check-code", sendCode);
router.post("/change-password", resetPassword);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
