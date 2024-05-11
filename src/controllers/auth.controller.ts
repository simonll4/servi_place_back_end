import { Request, Response, NextFunction } from "express";
import { createUser, findUser } from "../data_base/users.repository";

import { generateToken } from "../services/auth.service";

import { zParse, authRegisterSchema } from "../middlewares/validation.schemas";
import { comparePassword } from "../services/password.service";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //const { email, password } = req.body;

    // if (!email || !password) {
    //     res.status(400).json({ error: 'Email and password are required' });
    //     return;
    // }

    const { body } = await zParse(authRegisterSchema, req);
    const user = await createUser({
      email: body.email,
      password: body.password,
      role: body.role,
      name: body.name,
      last_name: body.lastName,
      profile_picture: body.profilePhoto || "",
    });

    const token = generateToken(user);
    res.status(201).json({ token });

  } catch (error) {
    next(error);
    // if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
    //     res.status(400).json({ error: 'Email already exists' });
    // }
    // else {
    //     res.status(500).json({ error: 'Something went wrong' });
    // }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // if (!email || !password) {
    //     res.status(400).json({ error: 'Email and password are required' });
    //     return;
    // }

    const user = await findUser({ email });

    if (!user) {
      throw new Error("Invalid credentials");
      // res.status(400).json({ error: 'Invalid credentials' });
      // return;
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
      // res.status(401).json({ error: 'Invalid credentials' });
      // return;
    }

    const token = generateToken(user);
    res.status(200).json({ token });

  } catch (error) {
    next(error);
  }
};
