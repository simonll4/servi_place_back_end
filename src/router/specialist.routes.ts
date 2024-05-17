import { Router } from "express";

import dashboardRoutesSpecialist from './specialist/dashboard.routes'


const router = Router();

// routes for specialist
router.use('/dashboard', dashboardRoutesSpecialist);



export default router;
