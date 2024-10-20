import express from 'express'
import { createBook, listBooks, updateBook } from './bookController'
import multer from 'multer'
import path from 'node:path'
import authenticate from '../middlewares/authenticate'


const bookRouter = express.Router()

// Multer
// multer kivabe kaj kore ?
// amar file ke amar project er local folder e add kore . then amra ekhan theke get kore cloudinary te store kore local folder theke file gula delete kore dey

const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'), // __dirname holo amader project folder ta return kore
  limits: { fileSize: 3e7 } // 30mb 
})

bookRouter.post('/', authenticate , upload.fields([
  { name : 'coverImage', maxCount: 1},
  { name : 'file', maxCount: 1 }
]) , createBook)
// upore name : 'coverImage' and 'file' holo bookModel theke neya hubuhu nam gula . tar mane ami form datay coverImage and file e ja pass korbo only sei 2 ta multer process kore cloudinary te dibe 

bookRouter.patch('/:bookId', authenticate , upload.fields([
  { name : 'coverImage', maxCount: 1},
  { name : 'file', maxCount: 1 }
]) , updateBook)

bookRouter.get('/', listBooks)


export default bookRouter