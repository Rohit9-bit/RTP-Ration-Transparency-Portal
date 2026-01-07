import {Router} from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import beneficiaryDashboard from '../controllers/benficiaryDashboard.controller.js';

const router = Router();

router.route("/").get(protectedRoute, beneficiaryDashboard);



export default router;
