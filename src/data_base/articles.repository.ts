import { type Articles } from '@prisma/client'
import prisma from './models/articles'

type CreateArticleType = Pick<Articles, 'title' | 'paragraph' | 'image' | 'categoryId' | 'authorId'>
type getArticlesByUserType = Pick<Articles, 'authorId'>
type FindArticleType = Pick<Articles, 'id'>

export const createArticle = async (article: CreateArticleType) => {
    return await prisma.create({
        data: {
            title: article.title,
            paragraph: article.paragraph,
            categoryId: article.categoryId,
            authorId: article.authorId,
            image: article.image
        }
    })
}

const getAllArticles = async (role: 'SPECIALIST' | 'CUSTOMER') => {
    return await prisma.findMany({
        where: {
            author: {
                role: role
            }
        }
    });
}
export const getAllSpecialistArticles = () => getAllArticles('SPECIALIST');
export const getAllCustomerArticles = () => getAllArticles('CUSTOMER');


export const getArticlesByUser = async (authorId: getArticlesByUserType) => {
    return await prisma.findMany({
        where: {
            authorId: authorId.authorId
        }
    })
}

export const findArticle = async (article: FindArticleType) => {
    return await prisma.findUnique({
        where: {
            id: article.id
        }
    })
}



