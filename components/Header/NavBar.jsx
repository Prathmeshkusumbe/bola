import Link from 'next/link'
import React from 'react'

function NavBar() {
  return (
    <nav className='flex'>
      <div className='pl-6 pr-6'><Link href='/'><span className="text-lg">Home</span>   </Link></div>
      <div className='pl-6 pr-6'><Link href='/about'><span className="text-lg">About</span>  </Link></div>
      <div className='pl-6 pr-6'><Link href='/faq'><span className="text-lg">FAQ</span>    </Link></div>
      <div className='pl-6 pr-6'><Link href='contact'><span className="text-lg">Contact</span></Link></div>
    </nav>
  )
}

export default NavBar