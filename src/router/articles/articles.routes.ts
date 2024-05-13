import express from 'express';
import  {getArticles}  from "../../controllers/articles.controller"

const router = express.Router();

router.get('/getAll', getArticles);


export default router;
