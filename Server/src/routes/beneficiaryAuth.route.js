import { Router } from "express";
import {

  loginBeneficiary,
  logOutBeneficiary,
  registerBeneficiary,
} from "../controllers/beneficiaryAuth.controller.js";

const router = Router();

router.route("/register").post(registerBeneficiary);
router.route("/login").post(loginBeneficiary);
router.route("/logOut").post(logOutBeneficiary);

export default router;
