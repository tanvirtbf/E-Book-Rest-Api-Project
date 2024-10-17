import express from 'express'
import { createBook } from './bookController'
import multer from 'multer'
import path from 'node:path'


const bookRouter = express.Router()

// Multer
// multer kivabe kaj kore ?
// amar file ke amar project er local folder e add kore . then amra ekhan theke get kore cloudinary te store kore local folder theke file gula delete kore dey

const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'), // __dirname holo amader project folder ta return kore
  limits: { fileSize: 3e7} // 30mb 
})

bookRouter.post('/', upload.fields([
  { name : 'coverImage', maxCount: 1},
  { name : 'file', maxCount: 1 }
]) , createBook)


export default bookRouter