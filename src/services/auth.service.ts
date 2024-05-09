// import { User } from '../data_base/interfaces/userInterface';
import type { user } from "@prisma/client";
import jwt from 'jsonwebtoken';

type CreateUserType = Pick<user, "id" | "email" | "password">;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (user: user): string => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}


