import { Router } from "express";
import {
  loginBeneficiary,
  logOutBeneficiary,
  registerBeneficiary,
} from "../controllers/beneficiaryAuth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerBeneficiary);
router.route("/login").post(loginBeneficiary);
router.route("/logOut").post(protectedRoute, logOutBeneficiary);

export default router;
