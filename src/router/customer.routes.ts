import { Router } from "express";
import authRoute from './auth.routes'

const router = Router();

// routes for customer
router.use('/auth', authRoute);

export default router;
