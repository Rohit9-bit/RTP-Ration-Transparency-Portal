import { Router } from "express";
import {
  deleteBeneficiaryAccount,
  getBeneficiaryAccountDetails,
  loginBeneficiary,
  logOutBeneficiary,
  registerBeneficiary,
  updateBeneficiaryAccountDetails,
} from "../controllers/beneficiaryAuth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerBeneficiary);
router.route("/login").post(loginBeneficiary);
router.route("/logOut").post(protectedRoute, logOutBeneficiary);
router.route("/account").get(protectedRoute, getBeneficiaryAccountDetails);
router
  .route("/account/update")
  .post(protectedRoute, updateBeneficiaryAccountDetails);
router.route("/account/delete").post(protectedRoute, deleteBeneficiaryAccount);

export default router;
