import { NextFunction, Request, Response } from "express";
import fs from 'fs'
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  
  const {title, genre} = req.body
  console.log(req.files)
  
  // CoverImage
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1)

  const fileName = files.coverImage[0].filename

  const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType
    })

    // File
    const bookFileName = files.file[0].filename
    const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName)
    const bookMimeType = files.file[0].mimetype.split('/').at(-1)

    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw', // image type data hole eta dorkar nei . jehetu eta pdf tai dorkar. karon cloudinary mainly image and video er jonno use hoy
      filename_override: bookFileName,
      folder: 'book-pdfs',
      format: bookMimeType,
    })

    // ekhane bookFileUploadResult er moddhe cloudinary oi pdf book ta store kore kichu information return kore jeta ai variable e hold kora hoise

    console.log('UploadResult : ', uploadResult)
    console.log('Book File Upload Result : ' , bookFileUploadResult)
    
    //@ts-ignore
    console.log('userId', req.userId)

    const newBook = await bookModel.create({
      title,
      genre,
      author: '6712778771cc9b7018ee1cc1',
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    })

    // Delete Temp Files (jokhon database e upload complete hoye jabe tokhonii file delete korte hobe)
    await fs.promises.unlink(filePath)
    await fs.promises.unlink(bookFilePath)

    res.status(201).json({ id : newBook._id })
    
  } catch (error) {
    return next(createHttpError(500, 'Error while uploading the files!'))
  }

}

export {createBook}