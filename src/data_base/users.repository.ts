

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


export const updateUserInformation = async (userId: number, updates: { name?: string, last_name?: string, email?: string, profile_picture?: string, description?: string }) => {
    const user = await prisma.findUnique({ where: { id: userId } });
    if (!user) return null;
    const updatedUser = await prisma.update({
        where: { id: userId },
        data: {
            ...updates
        }
    });

    return updatedUser;
}


export const getAllSpecialist = async () => {
    return await prisma.findMany({
        where: {
            role: 'SPECIALIST'
        },
        select: {
          id: true,
          name: true,
          last_name: true,
          description: true,
          profile_picture: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export const getSpecialistsByCategory = async (categoryId: number) => {
    return await prisma.findMany({
        where: {
            role: 'SPECIALIST',
            categories: {
                some: {
                    categoryId: categoryId
                }
            }
        },
        select: {
            id: true,
            name: true,
            last_name: true,
            description: true,
            profile_picture: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}