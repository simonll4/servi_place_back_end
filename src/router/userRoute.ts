import { error } from 'console';
import express, { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { createUser, deleteUser, getAllUsers, getUserByID, updateUser } from '../controllers/userController';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// middleware to authenticate token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // get token from header
    const token = authHeader && authHeader.split(' ')[1];
    // if there isn't any token
    if (token == null) return res.status(401).json({ error: 'not authorized' });
    // verify token
    Jwt.verify(token, JWT_SECRET, (err, decoded) => {
        // if token is invalid
        if (err) return res.status(403).json({ error: 'you do not have access to this resource' });
        // if token is valid, add user to request body
        //req.body.user = decoded;
        next();
    })

};

// add new user
router.post('/', authenticateToken, createUser);
// get all users
router.get('/', authenticateToken, getAllUsers);
// get user by id
router.get('/:id', authenticateToken, getUserByID);
// update user by id
router.put('/:id', authenticateToken, updateUser);
// delete user by id
router.delete('/:id', authenticateToken, deleteUser);

export default router;