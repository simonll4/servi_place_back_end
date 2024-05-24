import { type Categories } from '@prisma/client'
import prisma from './models/categories'

type createCategorieType = Pick<Categories, 'name'>
type getCategorieType = Pick<Categories, 'id'>

export const createCategory = async (category: createCategorieType) => {
  return await prisma.create({
    data: {
      name: category.name
    }
  })
}

export const getCategory = async (id: getCategorieType) => {
  return await prisma.findUnique({
    where: {
      id: id.id
    }
  })
}


const getArticlesByCategoryAndRole = async (id: getCategorieType, role: 'SPECIALIST' | 'CUSTOMER') => {
  const category = await prisma.findUnique({
    where: {
      id: id.id
    },
    include: {
      articles: {
        where: {
          author: {
            role: role
          }
        },
        select: {
          id: true,
          title: true,
          paragraph: true,
          image: true,
          authorId: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  if (category) {
    return category.articles;
  }
  return null;
}

export const getSpecialistArticlesByCategory = (id: getCategorieType) => getArticlesByCategoryAndRole(id, 'SPECIALIST');
export const getCustomerArticlesByCategory = (id: getCategorieType) => getArticlesByCategoryAndRole(id, 'CUSTOMER');
