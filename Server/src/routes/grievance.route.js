import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { newGrievance, recentGrievances } from "../controllers/grievance.controller.js";

const router = Router();

router.route("/submit").post(protectedRoute, newGrievance);
router.route("/recent").get(protectedRoute, recentGrievances);



export default router;