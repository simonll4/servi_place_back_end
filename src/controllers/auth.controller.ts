import { Request, Response, NextFunction } from 'express'
//db
import { createUser, findUser } from '../data_base/users.repository'
//Validation
import { authLoginSchema } from '../middlewares/validation/login.validation'
import { authRegisterSchema } from '../middlewares/validation/register.validation'
//Services
import { zParse } from '../services/zod.service'
import { comparePassword } from '../services/password.service'
import { generateToken } from '../services/auth.service'

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { body } = await zParse(authRegisterSchema, req)


        await findUser({ email: body.email })
        //res.status(409).json({ message: 'Email Already Exists' });

        const user = await createUser({
            email: body.email,
            password: body.password,
            role: body.role,
            name: body.name,
            last_name: body.lastName,
            profile_picture: body.profilePhoto || ''
        });

        const token = generateToken(user)
        res.status(201)
            .header('Authorization', 'Bearer ' + token)
            .json({ message: 'Register success', role: user.role });
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { body } = await zParse(authLoginSchema, req)
        const { email, password } = body

        const user = await findUser({ email })

        if (!user || !(await comparePassword(password, user?.password || ''))) {
            return next({ status: 401, message: 'Invalid credentials' })
        }

        const token = generateToken(user)
        res.status(200)
            .header('Authorization', 'Bearer ' + token)
            .json({ message: 'Login success', role: user.role });
    } catch (error) {
        next(error)
    }
}
