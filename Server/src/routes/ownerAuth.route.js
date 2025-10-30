import { Router } from "express";
import {
  registerShopOwner,
  loginManager,
  logOutManager,
} from "../controllers/ownerAuth.controller.js";
import { protectedRouteManager } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerShopOwner);
router.route("/login").post(loginManager);
router.route("/logout").post(protectedRouteManager, logOutManager);

export default router;
