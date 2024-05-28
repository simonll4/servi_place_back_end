import { Router } from "express";

import { getAllArticles, getMyLastArticle } from "../../controllers/articles.controller";
import { getMyInformation, updateMyInformation } from "../../controllers/users.information.controller";
import { getMyReviews, getSummaryreviewsByUser } from "../../controllers/reviews.controller";
import { asignCategory, deleteMyCategory, getAllSpecialistCategories } from "../../controllers/user.category.controller";


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
// get summary reviews from a user
router.get('/summary-reviews', getSummaryreviewsByUser);

//set category to specialist
router.put('/category/:id', asignCategory);
//delete category from specialist
router.delete('/category/:id', deleteMyCategory)
// get category from specialist
//router.get('/category', getMyCategories);
// get all categories from specialist
router.get('/categories', getAllSpecialistCategories)


export default router;