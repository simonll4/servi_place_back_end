import { Router } from "express";

import dashboardRoutesSpecialist from './specialist/dashboard.routes'
import myProfileRoutesSpecialist from './specialist/my.profile.routes'
import profileRoutes from "./customer/profile.routes";
import jobsRoutes from "./jobs/jobs.router";


const router = Router();

// routes for specialist
router.use('/dashboard', dashboardRoutesSpecialist);
router.use('/myProfile',myProfileRoutesSpecialist);
router.use('/profile', profileRoutes)
router.use('/jobs', jobsRoutes)


export default router;
