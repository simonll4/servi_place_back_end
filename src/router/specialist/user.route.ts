// import express, { NextFunction, Request, Response } from 'express';
// import Jwt from 'jsonwebtoken';
// import { error } from 'console';

import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserByID, updateUser } from '../../controllers/user.controller';

const router = express.Router();

// add new user
router.post('/', createUser);
// get all users
router.get('/', getAllUsers);
// get user by id
router.get('/one', getUserByID);
// update user by id
router.put('/one', updateUser);
// delete user by id
router.delete('/one', deleteUser);

export default router;