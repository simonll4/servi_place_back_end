// import express, { NextFunction, Request, Response } from 'express';
// import Jwt from 'jsonwebtoken';
// import { error } from 'console';

import express from 'express';
import { authenticateToken } from '../middlewares';
import { createUser, deleteUser, getAllUsers, getUserByID, updateUser } from '../controllers/userController';

const router = express.Router();


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