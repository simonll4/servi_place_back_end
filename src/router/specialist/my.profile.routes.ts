import { Router } from "express";

import { getAllArticles, getMyLastArticle } from "../../controllers/articles.controller";
import { getMyInformation, updateMyInformation } from "../../controllers/users.information.controller";
import { getMyReviews } from "../../controllers/reviews.controller";


const router = Router();

//actions that the specialist can perform from their profile 

// get my profile information
router.get('/my-information', getMyInformation);
// update my profile information
router.patch('/my-information', updateMyInformation);
// get my created articles
router.get('/articles', getAllArticles);
// get my reviews
router.get('/my-reviews', getMyReviews);
// get last article for profile preview
router.get('/last-article', getMyLastArticle);


export default router;