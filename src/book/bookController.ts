import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files)

  // CoverImage
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1)

  const fileName = files.coverImage[0].filename

  const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)

  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: 'book-covers',
    format: coverImageMimeType
  })

  // File

  console.log('UploadResult', uploadResult)
  res.json({})
}

export {createBook}