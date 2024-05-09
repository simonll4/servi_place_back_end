
import { type user } from "@prisma/client";
import prisma from './models/user';

import { hashPassword } from '../services/password.service';



type CreateUserType = Pick<user, "email" | "password">;
type FindUserType = Pick<user, "id"> | Pick<user, "email">;

export const createUser = async (user: CreateUserType) => {

    const hashedPassword = await hashPassword(user.password);

    return await prisma.create({
        data: {
            email: user.email,
            password: hashedPassword,
        }
    });
};

export const findUser = async (user: FindUserType) => {
    return await prisma.findUnique({
        where: user
    });
};