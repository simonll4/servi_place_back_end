import { Request, Response } from 'express';
import { hashPassword } from '../services/passwordService';
import prisma from '../data_base/models/user'


export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {

        if (!email || !password) {
            res.status(400).json({ error: 'email and password are required' });
            return;
        }
        const hashedPassword = await hashPassword(password);
        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        res.status(201).json(user);

    } catch (error: any) {

        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' });
        }
        else {
            res.status(500).json({ error: 'Something went wrong' });
        }

    }

};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {

        const users = await prisma.findMany();
        res.status(200).json(users);

    } catch (error: any) {

        res.status(500).json({ error: 'Something went wrong' });

    }
};

export const getUserByID = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id);
    try {

        const user = await prisma.findUnique({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);

    } catch (error: any) {

        res.status(500).json({ error: 'Something went wrong' });

    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    const { password } = req.body;
    try {

        let dataToUpdate: any = { ...req.body };
        if (password) {
            dataToUpdate.password = await hashPassword(password);
        }
        const user = await prisma.update({ where: { id: userId }, data: dataToUpdate });
        res.status(200).json(user);

    } catch (error: any) {

        if (error?.code === 'P2025') {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            res.status(500).json({ error: 'Something went wrong' });
        }

    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    try {

        await prisma.delete({ where: { id: userId } });
        res.status(204).json({ message: `User ${userId} deleted` }).end();

    } catch (error: any) {

        if (error?.code === 'P2025') {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            res.status(500).json({ error: 'Something went wrong' });
        }

    }
}

