import { Router } from "express";
import articleRoutes from './articles/articles.routes';

const router = Router();


router.use('/articles', articleRoutes)

// routes for customer


export default router;
