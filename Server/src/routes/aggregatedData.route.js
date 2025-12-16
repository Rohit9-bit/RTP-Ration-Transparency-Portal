import { Router } from "express";
import { dashboard } from "../controllers/aggregatedData.controller.js";

const router = Router();

router.route("/dashboard").get(dashboard);

export default router;
