import { Router } from "express";
import authRoute from './authentication/auth.routes';
import specialistRoutes from './specialist.routes';
import customerRoutes from './customer.routes';
import { authenticateToken } from "../middlewares/auth.jwt";


const router = Router();
// const router = Router();

//routes for auth
router.use('/auth', authRoute);
//routes for specialist
router.use('/specialist',authenticateToken, specialistRoutes);
//routes for customer
router.use('/customer',authenticateToken, customerRoutes);



export default router;