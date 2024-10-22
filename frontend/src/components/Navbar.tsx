import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='max-w-7xl mx-auto'>
      <div className='text-xl font-bold uppercase tracking-tight text-primary-500'>
        <Link href={'/'}>TBook</Link>
      </div>      
    </nav>
  )
}

export default Navbar