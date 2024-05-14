import { Request, Response, NextFunction } from "express";
import { createUser, findUser } from "../data_base/users.repository";

import { generateToken } from "../services/auth.service";

import { zParse, authRegisterSchema, authLoginSchema } from "../middlewares/validation.schemas";
import { comparePassword } from "../services/password.service";
import { cloudinaryUpload } from "../services/image.storage";


export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //const { email, password } = req.body;

    // if (!email || !password) {
    //     res.status(400).json({ error: 'Email and password are required' });
    //     return;
    // }

    

    const { body } = await zParse(authRegisterSchema, req);

    if(await findUser({email: body.email})){
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    
    const user = await createUser({
      email: body.email,
      password: body.password,
      role: body.role,
      name: body.name,
      last_name: body.lastName, 
      profile_picture: (body.profilePhoto) ? await cloudinaryUpload(body.profilePhoto, body.email).then((image) => {return image.secure_url}) : ""
    }) //ver si guardar el id o la url de la imagen, la url viene con HTTPS o HTTP

    

    const token = generateToken(user);
    res.status(201).json({ token: "bearer " + token });

  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { body } = await zParse(authLoginSchema, req);
    const { email, password } = body;

    const user = (await findUser({ email }));

    if (!user || (!await comparePassword(password, user?.password || ""))) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user);
    res.status(200).json({ token: "Bearer " + token });

  } catch (error) {
    
    next(error);
  }
};
