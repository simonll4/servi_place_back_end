import { Router } from "express";

import dashboardRoutesSpecialist from './specialist/dashboard.routes'
import myProfileRoutesSpecialist from './specialist/my.profile.routes'
import profileRoutes from "./customer/profile.routes";


const router = Router();

// routes for specialist
router.use('/dashboard', dashboardRoutesSpecialist);
router.use('/myProfile',myProfileRoutesSpecialist);
router.use('/profile', profileRoutes)


export default router;
