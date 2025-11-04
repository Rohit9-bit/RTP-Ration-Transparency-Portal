import { Router } from "express";
import {
  transactionHistory,
  approveTransaction,
} from "../controllers/transactionHistory.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/history").get(protectedRoute, transactionHistory);
router.route("/approve").post(protectedRoute, approveTransaction);

export default router;
