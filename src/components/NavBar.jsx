import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'

const NavBar = () => {
    return (
        <div>
            <nav className="m-5">
                <ul className='flex justify-between items-center list-none'>
                    <li>
                        <Link to="/" className="flex items-center gap-2 hover:underline hover:decoration-highlight hover:decoration-3">
                            <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
                            Healthy Recipe Finder
                        </Link>
                    </li>
                    <div className='flex gap-5'>
                        <li><Link to="/" className="hover:underline hover:decoration-highlight hover:decoration-3">Home</Link></li>
                        <li><Link to="/recipes" className="hover:underline hover:decoration-highlight hover:decoration-3">Recipes</Link></li>
                    </div>
                    <li className='ml-5'>
                        <Link to="/recipes" className="bg-primary text-white py-2.5 px-5 rounded-[5px] cursor-pointer hover:no-underline hover:opacity-80 transition-opacity duration-300">Browse Recipes</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default NavBar