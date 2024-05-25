import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';

import { Role } from "@prisma/client";


const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticateTokenSpecialist = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'not authorized' });

    Jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err?.name === 'TokenExpiredError') return res.status(403).json({ error: 'you do not have access to this resource' });
        // save the decoded data in the request object (lo agrega como un objeto ej req.body.decoded.id)
        req.body.decoded = decoded;
        if (!req.body.decoded || !req.body.decoded.role) {
            res.status(403).json({ error: 'you do not have access to this resource' });
            return;
        }
        if (req.body.decoded.role !== Role.SPECIALIST) return res.status(403).json({ error: 'you do not have access to this resource' })
        next();
    })
};


export const authenticateTokenCustomer = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'not authorized' });

    Jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err?.name === 'TokenExpiredError') return res.status(403).json({ error: 'you do not have access to this resource' });
        // save the decoded data in the request object (lo agrega como un objeto ej req.body.decoded.id)
        req.body.decoded = decoded;
        if (!req.body.decoded || !req.body.decoded.role) {
            res.status(403).json({ error: 'you do not have access to this resource' });
            return;
        }
        if (req.body.decoded.role !== Role.CUSTOMER) return res.status(403).json({ error: 'you do not have access to this resource' })
        next();
    })
};


