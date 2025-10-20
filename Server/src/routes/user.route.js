import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.route("/").get(userController)

export default router;