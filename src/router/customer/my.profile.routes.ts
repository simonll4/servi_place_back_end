import { Router } from "express";

import { getAllArticles } from "../../controllers/articles.controller";
import { getMyInformation, updateMyInformation } from "../../controllers/users.information.controller";

const router = Router();

//actions that the client can perform from their profile 

// get my profile information
router.get('/my-information', getMyInformation);
// update my profile information
router.patch('/my-information', updateMyInformation);
// get my created articles
router.get('/articles', getAllArticles);


export default router;