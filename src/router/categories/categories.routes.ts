import express from 'express';
import { getCategorie, createCategorie } from '../../controllers/categories.controller';


const router = express.Router();

router.post('/createCategorie', createCategorie )
router.get('/getCategorie', getCategorie)


export default router;