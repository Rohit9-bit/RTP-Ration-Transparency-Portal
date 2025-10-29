import { Router } from "express";
import {

  registerBeneficiary,
} from "../controllers/beneficiaryAuth.controller.js";

const router = Router();

router.route("/register").post(registerBeneficiary);

export default router;
