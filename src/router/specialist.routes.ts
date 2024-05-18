import { Router } from "express";

import dashboardRoutesSpecialist from './specialist/dashboard.routes'
import myProfileRoutesSpecialist from './specialist/my.profile.routes'
import profileRoutes from "./specialist/profile.routes";
import jobsRoutes from "./specialist/myjobs.routes";


const router = Router();

// Specialist routes for screens
router.use('/dashboard', dashboardRoutesSpecialist);
router.use('/myProfile',myProfileRoutesSpecialist);
router.use('/profile', profileRoutes)
router.use('/jobs', jobsRoutes)


export default router;
