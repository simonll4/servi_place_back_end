import { type Articles } from '@prisma/client'
import prisma from './models/articles'

type CreateArticleType = Pick<Articles, 'title' | 'paragraph' | 'image' | 'categoryId' | 'authorId'>
//type FindArticleType = Pick<Articles, 'id'>

export const createArticle = async (article: CreateArticleType) => {
    return await prisma.create({
        data: {
            title: article.title,
            paragraph: article.paragraph,
            image: article.image,
            categoryId: article.categoryId,
            authorId: article.authorId
        }
    })
}
