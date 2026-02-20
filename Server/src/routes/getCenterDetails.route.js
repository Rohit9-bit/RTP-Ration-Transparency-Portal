import express from "express";
import { getCenterDetails } from "../controllers/getCenterDetails.controller.js";

const router = express.Router();

router.get("/", getCenterDetails);

export default router;