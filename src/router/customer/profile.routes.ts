import express from 'express';

import { getProfileInformation } from '../../controllers/users.information.controller';
import { getAllArticlesByUser, getLastUserArticle } from '../../controllers/articles.controller';
import { getReviewsByUser, getSummaryreviewsByUser } from '../../controllers/reviews.controller';


const router = express.Router();

// actions that the client can perform from a third party profile or information that he can see

// get user information by id from a user
router.get('/user-information/:id', getProfileInformation);
// get all articles from a user
router.get('/articles/:id', getAllArticlesByUser);
// get last article from a specific user
router.get('/last-article/:id', getLastUserArticle);
// get reviews from a user
router.get('/reviews/:id', getReviewsByUser);
// get summary reviews from a user
router.get('/summary-reviews/:id',getSummaryreviewsByUser);


export default router;