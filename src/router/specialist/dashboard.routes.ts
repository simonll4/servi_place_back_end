import express from 'express';

import { getCustomerArticlesByCategories, postArticle } from '../../controllers/articles.controller';

const router = express.Router();


//actions that the client can perform from their dashboard

// create an article
router.post('/createArticle', postArticle);
// get articles by categories
router.get('/articles', getCustomerArticlesByCategories );


export default router;