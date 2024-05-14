import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';



const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'not authorized' });

    Jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err?.name === 'TokenExpiredError') return res.status(403).json({ error: 'you do not have access to this resource' });
        // save the decoded data in the request object (lo agrega como un objeto ej req.body.decoded.id)
        req.body.decoded = decoded;
        console.log(req.body);
        next();
    })
};


export const authenticateTokenSocket = (token: string) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    reject('Token has expired');
                } else {
                    reject('Token is not valid');
                }
            } else {
                resolve(decoded);
            }
        });
    });
};

