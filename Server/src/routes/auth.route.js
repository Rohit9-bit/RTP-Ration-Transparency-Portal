import { Router } from "express";
import {
  registerUser,
  loginUser,
  logOut,
  shopOwner,
  beneficiary_login,
  generate_ration_card,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logOut);
router.route("/shop-owner").post(shopOwner);
router.route("/generate-ration-card").post(generate_ration_card);
router.route("/beneficiary").post(beneficiary_login);

export default router;
