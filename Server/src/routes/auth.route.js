import { Router } from "express";
import {
  registerBeneficiary,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(registerBeneficiary)

export default router;
