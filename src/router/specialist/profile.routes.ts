import express from 'express';

import { getProfileInformation } from '../../controllers/users.information.controller';
import { getAllArticlesByUser } from '../../controllers/articles.controller';


const router = express.Router();

// actions that the client can perform from a third party profile or information that he can see
// get user information
router.get('/user-information/:id', getProfileInformation);
// get all articles from a customers users
router.get('/articles/:id', getAllArticlesByUser);

export default router;