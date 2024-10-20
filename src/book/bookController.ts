import { NextFunction, Request, Response } from "express";
import fs from 'fs'
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const {title, genre} = req.body
  // console.log(req.files)
  
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

    // console.log('UploadResult : ', uploadResult)
    // console.log('Book File Upload Result : ' , bookFileUploadResult)
    
    //@ts-ignore
    // console.log('userId', req.userId)

    const _req = req as AuthRequest

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  // Check access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You can not update others book."));
  }

  // check if image field is exists.

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    // send files to cloudinary
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: converMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // check if file field is exists.
  let completeFileName = "";
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + files.file[0].filename
    );

    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      genre: genre,
      title: title,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookModel.find()
    res.json(book)
  } catch (error) {
    next(createHttpError(500, 'Error while Getting all book list!'))
  }
}

const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
  // const bookId = req.params.bookId
  try {
    const book = await bookModel.findOne({ _id : req.params.bookId })
    if(!book){
      return next(createHttpError(404, 'Book Not Found!'))
    }
    return res.json(book)
  } catch (error) {
    return next(createHttpError(500, 'Error while getting single book!'))
  }
}

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId
  try {
    const book = await bookModel.findOne({ _id : bookId })
    if(!book) {
      return next(createHttpError(404, 'Book not found!'))
    } 

    // Check access : ai je user se ki delete korte parbe kina
    const _req = req as AuthRequest
    if(book.author.toString() !== _req.userId) {
      return next(createHttpError(403, 'You can not delete others book'))
    }

    // Delete from cloudinary
    const coverFileSplits = book.coverImage.split('/')
    const coverImagePublicId = coverFileSplits.at(-2) + '/' + (coverFileSplits.at(-1)?.split('.').at(-2))
    // console.log('coverImagePublicId : ',coverImagePublicId) 

    const bookFileSplits = book.file.split('/')
    const bookFilePublicId = bookFileSplits.at(-2) + '/' + bookFileSplits.at(-1)
    // console.log(bookFilePublicId)

    await cloudinary.uploader.destroy(coverImagePublicId)
    await cloudinary.uploader.destroy(bookFilePublicId , {
      resource_type: 'raw', // eta only image and video chara baki sob khetre ai extra parameter dite hoy delete korar somoy..
    })

    // Delete from Database 
    await bookModel.deleteOne({ _id : bookId })

    return res.sendStatus(204)
  } catch (error) {
    return next(createHttpError(500, 'Error while delete a book!'))
  }
}


export { createBook, updateBook, listBooks, getSingleBook, deleteBook }