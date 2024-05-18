import { Router } from "express";

import { getAllArticles } from "../../controllers/articles.controller";
import { getMyInformation } from "../../controllers/users.information.controller";


const router = Router();

//actions that the specialist can perform from their profile 

// get my profile information
router.get('/myInformation', getMyInformation);
// get my created articles
router.get('/articles', getAllArticles);



export default router;