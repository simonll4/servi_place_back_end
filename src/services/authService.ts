import { User } from '../data_base/interfaces/userInterface';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (user: User): string => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}


