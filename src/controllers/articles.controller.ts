import { NextFunction, Request, Response } from 'express'

import { createArticle, getArticlesByUser } from '../data_base/articles.repository'
import { findUser } from '../data_base/users.repository'
import { getCustomerArticlesByCategory, getSpecialistArticlesByCategory } from '../data_base/categories.repository'

import { articleSchema } from '../middlewares/validation/articles.validation'
import { zParse } from '../services/zod.service'


export const getAllArticlesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await findUser({ id: Number(req.query.id) })
        if (!user) return next({ name: 'NotFoundError' })

        const article = await getArticlesByUser({ authorId: user.id })
        res.status(200).json({ articles: article })

    } catch (err) {
        next(err)
    }
}

export const getAllArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await findUser({ id: req.body.decoded.id })
        if (!user) return next({ name: 'NotFoundError' })

        const articles = await getArticlesByUser({ authorId: user.id })
        res.status(200).json({ articles: articles })
    } catch (err) {
        next(err)
    }
}


///////////////////////////////////////////////////////////////////////////////
/////////////////ME TRAE UN SOLO ARTICULO///////////////////////////////////////
///////////////// POR SI LLEGA SI ES NECESARIO//////////////////////////////////
// export const getArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {

//         const article = await findArticle({ id: Number(req.query.id) })
//         if (!article) return next({ name: 'NotFoundError' })

//         res.status(200).json({ article: article })
//     } catch (err) {
//         next(err)
//     }
// }

export const postArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { body } = await zParse(articleSchema, req)

        const article = await createArticle({
            title: body.title,
            paragraph: body.paragraph,
            categoryId: body.categoryId,
            authorId: req.body.decoded.id,
            image: body.image
        })
        console.log(req.body)
        res.status(201).json({ message: 'Article created', article: article })
    } catch (error) {
        next(error)
    }
}



// const categories = [1, 2, 3]; // The category IDs you want to search for
// const url = `http://your-api-url/getArticlesByCategories?categories=${categories.join(',')}`;

// fetch(url)
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error:', error));

// export const getSpecialistArticlesByCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const params = req.query;


// eslint-disable-next-line @typescript-eslint/ban-types
async function getArticlesByCategories(req: Request, res: Response, next: NextFunction, getArticlesByCategory: Function): Promise<void> {
    const params = req.query;

    if (Object.keys(params).length === 0 || !params.categories) {
        res.status(400).json({ message: 'Bad request' });
    }

    try {
        const categories = String(params.categories).split(',');
        const articlesPromises = categories.map(async category => {
            const articles = await getArticlesByCategory({ id: Number(category) });
            return (articles && Object.keys(articles).length > 0) ? articles : null;
        });
        const articlesArrays = (await Promise.all(articlesPromises)).filter(article => article !== null);

        // devulve una lista de listas de objetos, cada lista es una categoria y los objetos son los articulos de esa categoria.
        res.status(200).json({ message: 'Articles by categories', articlesArrays });
    } catch (error) {
        next(error);
    }
}

export const getSpecialistArticlesByCategories = (req: Request, res: Response, next: NextFunction) => getArticlesByCategories(req, res, next, getSpecialistArticlesByCategory);
export const getCustomerArticlesByCategories = (req: Request, res: Response, next: NextFunction) => getArticlesByCategories(req, res, next, getCustomerArticlesByCategory);