import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import userModel from "./userModel"
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken"
import { config } from "../config/config"
import { User } from "./userTypes"

const createUser = async(req: Request, res: Response, next: NextFunction)=>{

  const {name,email,password} = req.body

  // validation
  if(!name || !email || !password) {
    const error = createHttpError(400, "All Fields are required!")
    return next(error)
  }

  try {

    // Database Call
    const user = await userModel.findOne({ email : email })
    
    if(user){
      const error = createHttpError(400, "User Already Exists with this email.")
      return next(error)
    }
    
  } catch (error) {
    return next(createHttpError(500, 'Error while getting user!'))
  }
  

  
  // password hashed
  const hashedPassword = await bcrypt.hash(password,10)

  let newUser: User
  
  try {

    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    })
    
  } catch (error) {
    return next(createHttpError(500, 'Error while creating user'))
  }
  

  try {
      // Token Generation JWT
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, { expiresIn: '1d', algorithm: "HS256"})

  // response
  res.status(201).json({ accessToken : token })

  } catch (error) {
    return next(createHttpError(500,'Error while signing the jwt token!'))
  }


}

const loginUser = async(req: Request, res: Response, next: NextFunction)=>{
  res.json({message : 'OK'})
}

export {createUser, loginUser}