import express from 'express';
import  {getArticles, postArticle}  from "../../controllers/articles.controller"

const router = express.Router();

router.get('/getAll', getArticles);
router.post('/create', postArticle);


export default router;
