import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema = new mongoose.Schema<Book>({
  title: {
    type : String,
    required : true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type : mongoose.Schema.ObjectId,
    // add ref
    ref: "User", // er mane holo ai book er moddhe jei author column ase seta connected ase User table er sathe . evabeii mongoose e reference add kora hoy 
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  }
}, { timestamps: true })

export default mongoose.model<Book>('Book', bookSchema)
