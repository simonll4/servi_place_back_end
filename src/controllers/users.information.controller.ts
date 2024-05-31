import { NextFunction, Request, Response } from 'express'
import { findUser, getAllSpecialist, getSpecialistsByCategory, updateUserInformation } from '../data_base/users.repository';


async function getUserInformation(userId: number) {

  const user = await findUser({ id: userId });

  if (!user) {
    return { status: 404, data: { error: 'User not found' } };
  }
  const { id, name, last_name, email, description, profile_picture } = user;

  return { status: 200, data: { id, name, last_name, email, description, profile_picture } };
}

export const getProfileInformation = async (req: Request, res: Response, next: NextFunction) => {

  const userId = Number(req.params.id);

  try {
    const user = await findUser({ id: userId });
    if (!user) return next({ error: 'Not found user' })
    if (user?.role === req.body.decoded.role) {
      res.status(403).json({ error: 'Access denied: roles are equal' });
      return;
    }
    const result = await getUserInformation(userId);

    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
}

export const getMyInformation = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const userId = req.body.decoded.id;
    const result = await getUserInformation(userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
}


export const updateMyInformation = async (req: Request, res: Response, next: NextFunction) => {

  const userId = req.body.decoded.id;
  const { name, last_name, email, profile_picture, description } = req.body;

  try {
    const updatedUser = await updateUserInformation(userId, { name, last_name, email, profile_picture, description });
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
}

// export const getAllSpecialist = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const specialists = await getSpecilists()
//     res.status(200).json({ SPECIALIST: specialists });
//   } catch (error) {
//     next(error);
//   }
// }



export const getSpecialists = async (req: Request, res: Response, next: NextFunction) => {

  const params = req.query;

  if (Object.keys(params).length === 0 || !params.categories) {
    try {
      const specialists = await getAllSpecialist();
      res.status(200).json({ message: 'Specialists by categories', specialists });
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
    const specialistsPromises = categories.map(async category => {
      const specialists = await getSpecialistsByCategory(Number(category));
      return (specialists && Object.keys(specialists).length > 0) ? specialists : null;
    });
    const specialistsArrays = (await Promise.all(specialistsPromises)).filter(specialist => specialist !== null);
    const flatSpecialistsArray = specialistsArrays.flat();
    const specialists = Array.from(new Set(flatSpecialistsArray.map(s => JSON.stringify(s)))).map(s => JSON.parse(s));
    res.status(200).json({ message: 'Specialists', specialists });
  } catch (error) {
    next(error);
  }
}