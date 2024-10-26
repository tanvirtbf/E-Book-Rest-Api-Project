import { Book } from '@/types'
import React from 'react'
import BookCard from './BookCard'

const BookList = ({ books }: {books: Book[]}) => {
  console.log(books)
  return (
    <div>
      {
        books.map((book)=> (
          <BookCard key={book._id} book={book} />
        ))
      }
    </div>
  )
}

export default BookList
