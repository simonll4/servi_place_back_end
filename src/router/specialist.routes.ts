import { Router } from "express";

import userRoute from './specialist/user.route'
import dashboardRoute from './specialist/dashboard.routes'


const router = Router();

// routes for specialist
router.use('/dashboard', dashboardRoute);



//este es para probar contra la tabla users
router.use('/user', userRoute);


export default router;
