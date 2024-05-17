import { NextFunction, Request, Response } from 'express'
import { createCategory, getCategory } from '../data_base/categories.repository'

export const createCategorie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {        
        const categorie = await createCategory(req.body)
        res.status(201).json({ message: 'Category created', categorie: categorie })
    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const getCategorie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.query.id
        const categorie = await getCategory({id: Number(id)})
        res.status(200).json({ categorie: categorie})
    } catch(err){
        next(err)
    }
}


