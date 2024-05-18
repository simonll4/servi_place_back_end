

import { type Users } from "@prisma/client";
import prisma from './models/users';

import { hashPassword } from '../services/password.service';

type CreateUserType = Pick<Users, "email" | "password" | "role" | "name" | "last_name" | "profile_picture">;
type FindUserType = Pick<Users, "id"> | Pick<Users, "email">;

export const createUser = async (user: CreateUserType) => {
    const hashedPassword = await hashPassword(user.password);
    return await prisma.create({
        data: {
            email: user.email,
            password: hashedPassword,
            role: user.role,
            name: user.name,
            last_name: user.last_name,
            description: '',
            profile_picture: user.profile_picture
        }
    });
};

export const findUser = async (user: FindUserType) => {
    return await prisma.findUnique({
        where: user
    });
};