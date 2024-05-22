import { Router } from "express";

import dashboardRoutesCustomer from './customer/dashboard.routes'
import myProfileRoutesCustomer from './customer/my.profile.routes'
import profileRoutes from './customer/profile.routes'
import jobsRoutes from "./customer/myjobs.routes";


const router = Router();

// Customer routes for screens
router.use('/dashboard', dashboardRoutesCustomer);
router.use('/my-profile', myProfileRoutesCustomer);
router.use('/profile', profileRoutes)
router.use('/jobs', jobsRoutes)


export default router;
