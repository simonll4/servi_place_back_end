import { NextFunction, Request, Response } from 'express'
import Jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = await req.headers['authorization']
    const token = authHeader && (authHeader as string)?.split(' ')[1]

    if (token == null || token === "") return next({ status: 401, message: 'Without token' })

    Jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError')
                return next({ status: 403, message: 'you do not have access to this resource' })
            return next(err) // Pasar cualquier otro error al errorHandler
        }
        // save the decoded data in the request object (lo agrega como un objeto ej req.body.decoded.id)
        req.body = { ...req.body, decoded }
        next()
    })
}
