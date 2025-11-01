import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller.js";
import { protectedRouteManager } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/submit-batch")
  .post(protectedRouteManager, transactionController);

export default router;
