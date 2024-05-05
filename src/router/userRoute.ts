import express from 'express';

const router = express.Router();

// middleware to authenticate token
const authenticateToken = () => {};

// add new user
router.post('/',authenticateToken, );
// get all users
router.get('/',authenticateToken, );
// get user by id
router.get('/:id',authenticateToken, );

router.put('/:id',authenticateToken, );
router.delete('/:id',authenticateToken, );

export default router;