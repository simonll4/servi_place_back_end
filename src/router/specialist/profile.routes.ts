import express from 'express';

import { getProfileInformation } from '../../controllers/users.information.controller';
import { getAllArticlesByUser } from '../../controllers/articles.controller';


const router = express.Router();

// actions that the client can perform from a third party profile or information that he can see

// get user information
router.get('/userInformation', getProfileInformation);
router.get('/getAllUserArticles',getAllArticlesByUser);

export default router;