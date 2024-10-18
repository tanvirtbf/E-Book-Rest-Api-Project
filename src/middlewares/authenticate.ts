import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if(!token){
        return next(createHttpError(401, 'Authorization token is required!'))
    }

    const parsedToken = token.split(' ')[1]
}