import express from 'express';

import { getCustomerArticlesByCategories, postArticle } from '../../controllers/articles.controller';

const router = express.Router();


//actions that the client can perform from their dashboard
router.post('/createArticle', postArticle);
router.get('/articles', getCustomerArticlesByCategories );


export default router;