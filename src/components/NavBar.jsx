import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <div>
            <nav>
                <ul className='flex justify-between items-center'>
                    <li><Link to="/">Healthy Recipe Finder</Link></li>
                    <div className='flex gap-5'>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/recipes">Recipes</Link></li>
                    </div>
                    <li className='ml-5'>
                        <Link to="/recipes" className="button button-primary">Browse Recipes</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default NavBar