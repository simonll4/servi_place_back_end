import express from 'express';
import  {getAllArticles, getAllArticlesByUser, getArticle, postArticle}  from "../../controllers/articles.controller"

const router = express.Router();

router.get('/getAll', getAllArticles);
router.post('/create', postArticle);
router.get('/getArticle', getArticle);
router.get('/getAllByUser', getAllArticlesByUser);

export default router;
