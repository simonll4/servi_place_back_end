import { NextFunction, Request, Response } from 'express'
import { findUser } from '../data_base/users.repository';


async function getUserInformation(userId: number) {
  const user = await findUser({ id: userId });
  if (!user) {
    return { status: 404, data: { message: 'User not found' } };
  }
  const { name, last_name, description, profile_picture } = user;
  return { status: 200, data: { name, last_name, description, profile_picture } };
}

export const getProfileInformation = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.query.id);

  try {
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
