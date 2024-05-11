import { Router } from "express";

import dashboardRoute from './specialist/dashboard.routes'


const router = Router();

// routes for specialist
router.use('/dashboard', dashboardRoute);



export default router;
