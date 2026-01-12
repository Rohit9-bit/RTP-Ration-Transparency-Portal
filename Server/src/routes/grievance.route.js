import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { newGrievance, allGrievances } from "../controllers/grievance.controller.js";

const router = Router();

router.route("/submit").post(protectedRoute, newGrievance);
router.route("/history").get(protectedRoute, allGrievances);



export default router;