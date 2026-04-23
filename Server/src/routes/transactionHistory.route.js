import { Router } from "express";
import {
  transactionHistory,
  approveTransaction,
  recentTransactions,
} from "../controllers/transactionHistory.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/history").get(protectedRoute, transactionHistory);
router.route("/approve").post(protectedRoute, approveTransaction);
router.route("/recent").get(protectedRoute, recentTransactions);

export default router;
