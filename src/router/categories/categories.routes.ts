import express from 'express';
import { getCategorie, createCategorie } from '../../controllers/categories.controller';


const router = express.Router();

router.post('/createCategory', createCategorie )
router.get('/getCategory', getCategorie)


export default router;