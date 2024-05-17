import express from 'express';
import { getCustomerArticlesByCategories } from '../../controllers/articles.controller';

const router = express.Router();


//actions that the client can perform from their dashboard
router.get('/articles', getCustomerArticlesByCategories );


export default router;