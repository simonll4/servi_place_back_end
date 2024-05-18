import { Router } from "express";

import { getAllArticles } from "../../controllers/articles.controller";
import { getMyInformation } from "../../controllers/users.information.controller";


const router = Router();

//actions that the specialist can perform from their profile 
router.get('/myInformation', getMyInformation);
router.get('/articles', getAllArticles);



export default router;