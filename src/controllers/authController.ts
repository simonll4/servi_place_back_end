import e, { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../services/passwordService';
import { generateToken } from '../services/authService';
import prisma from '../data_base/models/user';


export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword,
            }
        });
        const token = generateToken(user);
        res.status(201).json({ token });

    } catch (error: any) {
        console.log(error);

        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' });
        }
        else {
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const user = await prisma.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user);
        res.status(200).json({ token });

    } catch (error) {

    }
};