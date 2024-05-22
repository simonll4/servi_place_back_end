import express from 'express';

import { getSpecialistArticlesByCategories, postArticle } from '../../controllers/articles.controller';


const router = express.Router();


// actions that the customer can do from the dashboard or information that he can see
// create an article
router.post('/createarticle', postArticle);
// get articles by categories
router.get('/articles', getSpecialistArticlesByCategories);


export default router;