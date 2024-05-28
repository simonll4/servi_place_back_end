import { Request, Response, NextFunction } from 'express'
import { asignSpecialistCategory, deleteSpecialistCategory, getSpecialistCategory } from '../data_base/user.category.repository';



export const asignCategory = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const categoryId = Number(req.params.id);
    const specialistId = req.body.decoded.id;

    const category = await asignSpecialistCategory({ userId: specialistId, categoryId: categoryId });
    console.log(category);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }

}

// export const getMyCategories = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const specialistId = req.body.decoded.id;
//     const category = await getSpecialistCategory(specialistId);
//     res.status(200).json(category);
//   } catch (error) {
//     next(error);
//   }
// }

export const deleteMyCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = Number(req.params.id);
    const specialistId = Number(req.body.decoded.id);
    const category = await deleteSpecialistCategory({ userId: specialistId, categoryId: categoryId });
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

export const getAllSpecialistCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {

    let specialistId;
    if (req.body.decoded.role === 'SPECIALIST') {
      specialistId = Number(req.body.decoded.id);
    }
    if (req.body.decoded.role === 'CUSTOMER') {
      specialistId = Number(req.params.id);
    }
    if (!specialistId) {
      res.status(404).json({ error: 'Specialist not found' });
      return;
    }

    const category = await getSpecialistCategory(specialistId);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}