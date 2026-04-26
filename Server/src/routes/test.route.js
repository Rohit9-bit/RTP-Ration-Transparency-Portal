import { Router } from "express";

const router = Router();

router.route("/test").get((req, res) => {
  res.json({ message: "Test route is working!" });
});

export default router;