//import { zParse, authRegisterSchema } from "../middlewares/validation.schemas";
import { Request, Response } from "express";



export const getArticles = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Articles'});
};

export const postArticle = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json({ message: 'Article created'});
}

