import { NextFunction, Request, Response } from 'express'
import { createArticle } from '../data_base/articles.repository'
import { cloudinaryUpload } from '../services/cloudinary.service'
import { findUser } from '../data_base/users.repository'

export const getArticles = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Articles' })
}

export const postArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //Aca ya estamos con el token validado... en el req.body viene todo lo que mande, mas lo que decodifico del JWT.
    try {

        //Hara falta???? este control???
        const user = await findUser({ id: req.body.decoded.id })
        //Lo mismo para la categoria... si no existe la categoria, no se puede crear el articulo.
        if(!user) return next({ name: 'NotFoundError' });
        
        const cloudinaryPath = 'articles/'
        const article = await createArticle(
            {
                title: req.body.title,
                paragraph: req.body.paragraph,
                categoryId: req.body.categoryId,
                authorId: req.body.decoded.id,
                image: req.body.image ? await cloudinaryUpload(req.body.image, req.body.decoded.email, cloudinaryPath).then(image => {
                    return image.secure_url
                }) : ""
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