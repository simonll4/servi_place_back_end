import { z } from "zod";

const emailSchema = z.string().email({ "message": "Invalid email format" });
const passwordSchema = z.string().min(8, { "message": "Password must be at least 8 characters long" });

const authRegisterBody = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export const authRegisterSchema = z.object({
    body: authRegisterBody
});

const authLoginBody = z.object({
    email: emailSchema,
    password: passwordSchema
});

export const authLoginSchema = z.object({
    body: authLoginBody
});

import express, { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';

import { findUser } from '../data_base/user.repository';
import { decode } from "punycode";


const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// middleware to authenticate token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // get token from header
    const token = authHeader && authHeader.split(' ')[1];
    // if there isn't any token
    if (token == null) return res.status(401).json({ error: 'not authorized' });
    // verify token
    Jwt.verify(token, JWT_SECRET, async (err, decoded) => {

        if (err) return res.status(403).json({ error: 'you do not have access to this resource' });

        if (typeof decoded === 'object' && 'id' in decoded) {
            try {

                // find user by id
                const userFind = await findUser({ id: decoded.id });
                if (userFind === null) {
                    throw new Error('User not found');
                }
                // check if the user making the request is the same as the user found
                if (req.body.user && req.body.user.id === userFind.id) {
                    next();
                } else {
                    throw new Error('Token does not match user');
                }

            } catch (error) {
                next(error);
            }

        } else {
            throw new Error('Invalid token');
        }

    })
};


