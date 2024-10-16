import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import userModel from "./userModel"

const createUser = async(req: Request,res: Response,next: NextFunction)=>{

  const {name,email,password} = req.body

  // validation
  if(!name || !email || !password) {
    const error = createHttpError(400, "All Fields are required!")
    return next(error)
  }
  
  // Database Call
  const user = await userModel.findOne({ email : email })
  
  if(user){
    const error = createHttpError(400, "User Already Exists with this email.")
    return next(error)
  }

  // process
  // response

  res.json({ message : 'User Created!'})
}

export {createUser}