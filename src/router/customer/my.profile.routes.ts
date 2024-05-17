import { Router } from "express";

import { getAllArticles } from "../../controllers/articles.controller";

const router = Router();

//actions that the client can perform from their profile 
router.get('/articles', getAllArticles);

export default router;