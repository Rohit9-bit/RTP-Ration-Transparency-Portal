import express from "express";
import { protectedRoute } from "./auth.middleware.js";

const router = express.Router();

router.route("/check").get(protectedRoute, (req, res) => {
  res.status(200).json({ message: "Token is valid!" });
});

export default router;
