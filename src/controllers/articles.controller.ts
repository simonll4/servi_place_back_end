import { NextFunction, Request, Response } from 'express'
import { createArticle, getArticlesByUser, findArticle } from '../data_base/articles.repository'
import { cloudinaryUpload } from '../services/cloudinary.service'
import { findUser } from '../data_base/users.repository'

//GETs
//Todos los articulos por usuario.
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

export const getArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const article = await findArticle({ id: Number(req.query.id) })
        if (!article) return next({ name: 'NotFoundError' })

        res.status(200).json({ article: article })
    } catch (err) {
        console.log("jejeje")
        next(err)
    }
}

export const postArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //Aca ya estamos con el token validado... en el req.body viene todo lo que mande, mas lo que decodifico del JWT.
    try {
        //Hara falta???? este control???
        const user = await findUser({ id: req.body.decoded.id })
        //Lo mismo para la categoria... si no existe la categoria, no se puede crear el articulo.
        if (!user) return next({ name: 'NotFoundError' })

        const cloudinaryPath = 'articles/'
        const article = await createArticle({
            title: req.body.title,
            paragraph: req.body.paragraph,
            categoryId: req.body.categoryId,
            authorId: req.body.decoded.id,
            image: req.body.image
                ? await cloudinaryUpload(req.body.image, req.body.decoded.email, cloudinaryPath).then((image) => {
                      return image.secure_url
                  })
                : ''
        })
        res.status(201).json({ message: 'Article created', article: article })
    } catch (err) {
        console.log(err)
        next(err)
    }
}

// model Articles {
// id         Int        @id @default(autoincrement())
// title      String
// paragraph  String
// image      String
// authorId   Int
// categoryId Int
// author     Users      @relation(fields: [authorId], references: [id])
// category   Categories @relation(fields: [categoryId], references: [id])
// createdAt  DateTime   @default(now())
// updatedAt  DateTime   @updatedAt
//   }
