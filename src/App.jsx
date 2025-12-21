import React from 'react'
import NavBar from './components/NavBar'
import Home from './components/Home'
import Recipes from './components/Recipes'
import RecipeDetails from './components/RecipeDetails'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <div>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipes/:id" element={<RecipeDetails />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
export default App