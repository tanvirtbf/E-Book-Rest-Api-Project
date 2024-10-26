import { Book } from '@/types'
import React from 'react'

const BookList = ({ books }: {books: Book[]}) => {
  console.log(books)
  return (
    <div>
      {
        books.map((book)=> (
          <h1 key={book._id}>{book.title}</h1>
        ))
      }
    </div>
  )
}

export default BookList
