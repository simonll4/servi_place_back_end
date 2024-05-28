import prisma from './models/user.category';
import { UserCategory } from '@prisma/client';


type categoryType = Pick<UserCategory, 'userId' | 'categoryId'>

export const asignSpecialistCategory = async (category: categoryType) => {

  return await prisma.create({
    data: {
      userId: category.userId,
      categoryId: category.categoryId
    }
  });
}

export const getSpecialistCategory = async (userId: number) => {
  return await prisma.findMany({
    where: {
      userId: userId
    }
  });
}

export const deleteSpecialistCategory = async (category: categoryType) => {
  return await prisma.delete({
    where: {
      userId_categoryId: {
        userId: category.userId,
        categoryId: category.categoryId
      }
    }
  });
}
