import { NextFunction, Request, Response } from 'express'
import { createArticle } from '../data_base/articles.repository'

export const getArticles = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Articles' })
}

export const postArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //Aca ya estamos con el token validado... en el req.body viene todo lo que mande, mas lo que decodifico del JWT.
    console.dir(req.body)
    try {
        const article = await createArticle(
            {
                title: req.body.title,
                paragraph: req.body.paragraph,
                image: req.body.image, //agregar cloudinary
                categoryId: req.body.categoryId,
                authorId: req.body.decoded.id
            }
        )
        res.status(201).json({ message: 'Article created', article: article })
    } catch(err) {
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