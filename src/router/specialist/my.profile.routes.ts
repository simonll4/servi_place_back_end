import { Router } from "express";

import { getAllArticles, getMyLastArticle } from "../../controllers/articles.controller";
import { getMyInformation } from "../../controllers/users.information.controller";
import { getMyReviews } from "../../controllers/reviews.controller";


const router = Router();

//actions that the specialist can perform from their profile 

// get my profile information
router.get('/myInformation', getMyInformation);
// get my created articles
router.get('/articles', getAllArticles);
// get my reviews
router.get('/myreviews', getMyReviews);
// get last article for profile preview
router.get('/lastarticle', getMyLastArticle);


export default router;