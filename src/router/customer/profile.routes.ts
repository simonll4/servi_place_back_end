import express from 'express';

import { getProfileInformation } from '../../controllers/users.information.controller';
import { getAllArticlesByUser, getLastUserArticle } from '../../controllers/articles.controller';
import { getReviewsByUser } from '../../controllers/reviews.controller';


const router = express.Router();

// actions that the client can perform from a third party profile or information that he can see

// get user information
router.get('/userInformation', getProfileInformation);
// get all articles from a user
router.get('/getAllUserArticles', getAllArticlesByUser);
// get reviews from a user
router.get('/reviews/:id', getReviewsByUser);
// get last article from a specific user
router.get('/lastarticle/:id', getLastUserArticle);


export default router;