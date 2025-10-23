import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.route("/users").post(userController)

export default router;