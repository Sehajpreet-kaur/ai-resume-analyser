import React from 'react'
import {Link} from 'react-router'
import Logout from './Logout'

function Navbar() {
  return (
    <nav className='navbar'>
        <Link to="/">
            <p className='text-2xl font-bold text-gradient'>RESUMIND</p>
        </Link>
        <div className='flex flex-row justify-between gap-4'>
          <Link to="/upload" className='primary-button w-fit'>
            Upload Resume
        </Link>
        <Logout />
        </div>
    </nav>
  )
}

export default Navbar
