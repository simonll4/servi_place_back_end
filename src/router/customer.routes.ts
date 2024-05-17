import { Router } from "express";

import dashboardRoutesCustomer from './customer/dashboard.routes'
import myProfileRoutesCustomer from './customer/my.profile.routes'
import profileRoutes from './customer/profile.routes'

const router = Router();


// routes for customer
router.use('/dashboard', dashboardRoutesCustomer);
router.use('/myProfile', myProfileRoutesCustomer);
router.use('/profile', profileRoutes)


export default router;
