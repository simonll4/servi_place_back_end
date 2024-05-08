import { Router } from "express";

import authRoute from './auth.routes'
import userRoute from './user.route'


const router = Router();

// routes for specialist
router.use('/auth', authRoute);
router.use('/user', userRoute);


export default router;
