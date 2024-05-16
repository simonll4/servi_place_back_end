// import { User } from '../data_base/interfaces/userInterface';
import type { Users } from "@prisma/client";
import jwt from 'jsonwebtoken';

type UserType = Pick<Users, "id" | "role">;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (user: UserType): string => {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}


