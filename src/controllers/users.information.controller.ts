import { NextFunction, Request, Response } from 'express'
import { findUser } from '../data_base/users.repository';



export const getProfileInformation = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.query.id;


  try {
    const user = await findUser({ id: Number(userId) });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const { name, last_name, email, profile_picture } = user;
    res.status(200).json({ name, last_name, email, profile_picture });
  } catch (error) {
    next(error);  
  }
}


