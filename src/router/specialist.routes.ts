import { Router } from "express";

import userRoute from './specialist/user.route'


const router = Router();

// routes for specialist
router.use('/user', userRoute);


export default router;
