import { NextFunction, Request, Response } from 'express'
import { findUser, updateUserInformation } from '../data_base/users.repository';


async function getUserInformation(userId: number) {
  const user = await findUser({ id: userId });

  if (!user) {
    return { status: 404, data: { error: 'User not found' } };
  }
  const { name, last_name, email, description, profile_picture } = user;

  return { status: 200, data: { name, last_name, email, description, profile_picture } };
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

  const userId = req.body.decoded.id;

  try {
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