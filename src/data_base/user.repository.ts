import { NextFunction } from "express";
import type { user } from "@prisma/client";
import prisma from './models/user';

import { generateToken } from '../services/authService';
import { comparePassword, hashPassword } from '../services/passwordService';
import { nextTick } from "process";


type CreateUserType = Pick<user, "email" | "password">;
type FindUserType = Pick<user, "id">;
// type UpdateAuthType = Partial<user>; //Change Password
// type getAuthType = Pick<user, "email" | "password">;

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
}

// export const getAuth = async (auth: getAuthType) => {
//     const userExist = await prisma.auth.findUnique({
//         where: { email: auth.email },
//     });

//     if (userExist === null) {
//         return 404; // Case when the email is not found.
//     }

//     if (await comparePassword(auth.password, userExist.password)){
//         return {userExist, token: generateAccessToken(userExist.email)};
//     } else {
//         return 401; // Case when the password is not correct.
//     }
// };

// export const updateAuth = async (auth: getAuthType, updatedAuth: UpdateAuthType) => {
//     const passwordCrypted = await hashPassword(updatedAuth.password);
//     return await prisma.auth.update({
//         where: auth,
//         data: {
//             password: passwordCrypted
//         }
//     });
// };