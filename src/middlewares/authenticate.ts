import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";


const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if(!token){
        return next(createHttpError(401, 'Authorization token is required!'))
    }

    const parsedToken = token.split(' ')[1]

    // Token Decoded or verified..
    const decoded = verify(parsedToken, config.jwtSecret as string)
    console.log('decoded: ', decoded)
    // req.userId = decoded.sub
    next()

}

export default authenticate