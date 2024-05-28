import { Router } from "express";

import authRoute from './authentication/auth.routes';
import specialistRoutes from './specialist.routes';
import customerRoutes from './customer.routes';


import { authenticateTokenCustomer, authenticateTokenSpecialist } from "../middlewares/auth.jwt";
import categoriesRoutes from "./categories/categories.routes";



const router = Router();

//routes for auth
router.use('/auth', authRoute);
//routes for specialist
router.use('/specialist', authenticateTokenSpecialist, specialistRoutes);
//routes for customer
router.use('/customer', authenticateTokenCustomer, customerRoutes);

// MODERATOR
router.use('/categories',categoriesRoutes);


export default router;