import { Router } from "express";
import authRoute from './authentication/auth.routes';
import specialistRoutes from './specialist.routes';
import customerRoutes from './customer.routes';
import { authenticateTokenCustomer, authenticateTokenSpecialist } from "../middlewares/auth.jwt";
import categoriesRoute from './categories/categories.routes';


const router = Router();
// const router = Router();

//routes for auth
router.use('/auth', authRoute);
//routes for specialist
router.use('/specialist',authenticateTokenSpecialist, specialistRoutes);
//routes for customer
router.use('/customer',authenticateTokenCustomer, customerRoutes);
//routes for categories -- No creo que las usemos, pero las dejo por si acaso. Esto seria solo de nosotros supongo o un admin...
router.use('/categories', categoriesRoute)



export default router;