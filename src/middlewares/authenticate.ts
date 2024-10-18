import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userId : string
}
// etar mane holo Request type jeta express theke ashce seta req er sob method er type define kore amk dise . kintu ami force kore req object er moddhe kono notun variable add korle setar type Request type e thake na . tai Request type ke extends kore extra type add kora holo ekhane

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if(!token){
        return next(createHttpError(401, 'Authorization token is required!'))
    }
    
    try {
        const parsedToken = token.split(' ')[1]
        // Token Decoded or verified..
        const decoded = verify(parsedToken, config.jwtSecret as string)
        // console.log('decoded: ', decoded)
        const _req = req as AuthRequest
        _req.userId = decoded.sub as string
     
        next()
        
    } catch (error) {
        return next(createHttpError(401, 'Token expired!'))
    }


}

export default authenticate