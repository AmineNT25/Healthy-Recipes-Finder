import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

import logo from '../assets/logo.png'

const NavBar = () => {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("")

    async function handleLogout() {
        setError("")

        try {
            await logout()
            navigate("/login")
        } catch {
            setError("Failed to log out")
        }
    }

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
                    <div className='flex gap-5 items-center'>
                        <li><Link to="/" className="hover:underline hover:decoration-highlight hover:decoration-3">Home</Link></li>
                        <li><Link to="/recipes" className="hover:underline hover:decoration-highlight hover:decoration-3">Recipes</Link></li>
                        {currentUser && (
                            <>
                                <li><Link to="/favorites" className="hover:underline hover:decoration-highlight hover:decoration-3">Favorites</Link></li>
                                <li><Link to="/my-recipes" className="hover:underline hover:decoration-highlight hover:decoration-3">My Recipes</Link></li>
                                <li><Link to="/add-recipe" className="hover:underline hover:decoration-highlight hover:decoration-3">Add Recipe</Link></li>
                            </>
                        )}
                    </div>
                    <li className='ml-5 flex gap-4'>
                        {!currentUser ? (
                            <>
                                <Link to="/login" className="bg-primary text-white py-2.5 px-5 rounded-[5px] cursor-pointer hover:no-underline hover:opacity-80 transition-opacity duration-300">Log In</Link>
                                <Link to="/signup" className="border border-primary text-primary py-2.5 px-5 rounded-[5px] cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300">Sign Up</Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="bg-red-500 text-white py-2.5 px-5 rounded-[5px] cursor-pointer hover:opacity-80 transition-opacity duration-300">Log Out</button>
                        )}
                    </li>
                </ul>
            </nav>
            {error && <div className="text-red-500 text-center">{error}</div>}
        </div>
    )
}

export default NavBar