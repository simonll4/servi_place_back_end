import { type Categories } from '@prisma/client'
import prisma from './models/categories'

type createCategorieType = Pick<Categories, 'name' >
type getCategorieType = Pick<Categories, 'id' >

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



export const getSpecialistArticlesByCategory = async (id: getCategorieType) => {
    const category = await prisma.findUnique({
      where: {
        id: id.id
      },
      include: {
        articles: {
          where: {
            author: {
              role: 'SPECIALIST'
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


  export const getCustomerArticlesByCategory = async (id: getCategorieType) => {
    const category = await prisma.findUnique({
      where: {
        id: id.id
      },
      include: {
        articles: {
          where: {
            author: {
              role: 'CUSTOMER'
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