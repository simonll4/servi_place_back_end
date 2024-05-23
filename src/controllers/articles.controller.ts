import { NextFunction, Request, Response } from 'express'
import { createArticle, getAllCustomerArticles, getAllSpecialistArticles, getArticlesByUser, lastArticleByUser } from '../data_base/articles.repository'
import { findUser } from '../data_base/users.repository'
import { getCustomerArticlesByCategory, getSpecialistArticlesByCategory } from '../data_base/categories.repository'
import { articleSchema } from '../middlewares/validation/articles.validation'
import { zParse } from '../services/zod.service'


export const getAllArticlesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = Number(req.params.id)
        const user = await findUser({ id: userId })

        if (!user) return next({ error: 'Not found user' })
        if (user?.role === req.body.decoded.role) {
            res.status(403).json({ error: 'Access denied: roles are equal' });
            return;
        }
        const article = await getArticlesByUser({ authorId: user.id })

        res.status(200).json({ articles: article })
    } catch (error) {
        next(error)
    }
}

export const getAllArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const articles = await getArticlesByUser({ authorId: req.body.decoded.id })

        res.status(200).json({ articles: articles })
    } catch (error) {
        next(error)
    }
}


const getLastArticle = async (userId: number, res: Response, next: NextFunction): Promise<void> => {
    try {
        const article = await lastArticleByUser(userId)

        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }

        res.status(200).json({ article: article })
    } catch (error) {
        next(error)
    }
}

export const getMyLastArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = Number(req.body.decoded.id);
    getLastArticle(userId, res, next);
}

export const getLastUserArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = Number(req.params.id);
    if (!await findUser({ id: userId })) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    getLastArticle(userId, res, next);
}

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

        res.status(201).json({ message: 'Article created', article: article })
    } catch (error) {
        next(error)
    }
}


// eslint-disable-next-line @typescript-eslint/ban-types
async function getArticlesByCategories(req: Request, res: Response, next: NextFunction, getArticlesByCategory: Function, getAll: Function): Promise<void> {
    const params = req.query;

    if (Object.keys(params).length === 0 || !params.categories) {
        try {
            const allArticles = await getAll();
            res.status(200).json({ message: 'All article`s', allArticles });
        } catch (error) {
            next(error);
        }
        return;
    }

    const categories = String(params.categories).split(',');
    if (categories.length > 5) {
        res.status(400).json({ error: 'Parameter limit exceeded, only 5 categories are allowed.' });
        return
    }

    try {

        const articlesPromises = categories.map(async category => {
            const articles = await getArticlesByCategory({ id: Number(category) });
            return (articles && Object.keys(articles).length > 0) ? articles : null;
        });
        const articlesArrays = (await Promise.all(articlesPromises)).filter(article => article !== null);
        // grabs the array of article arrays and turns it into a single array
        const flatArticlesArray = articlesArrays.flat();
        // Sort the articles by date
        const sortedArticles = flatArticlesArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Returns a list of objects, where each object is an item.
        res.status(200).json({ message: 'Articles by categories', sortedArticles });
    } catch (error) {
        next(error);
    }
}

export const getSpecialistArticlesByCategories = (req: Request, res: Response, next: NextFunction) => getArticlesByCategories(req, res, next, getSpecialistArticlesByCategory, getAllSpecialistArticles);
export const getCustomerArticlesByCategories = (req: Request, res: Response, next: NextFunction) => getArticlesByCategories(req, res, next, getCustomerArticlesByCategory, getAllCustomerArticles);