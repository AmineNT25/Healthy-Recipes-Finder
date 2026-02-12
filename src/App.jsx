import React from 'react'
import NavBar from './components/NavBar'
import Home from './components/Home'
import Recipes from './components/Recipes'
import RecipeDetails from './components/RecipeDetails'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Signup from './components/Signup'
import Login from './components/Login'
import AddRecipe from './components/AddRecipe'
import Favorites from './components/Favorites'
import MyRecipes from './components/MyRecipes'
import EditRecipe from './components/EditRecipe'

function App() {
    return (
        <div>
            <BrowserRouter>
                <AuthProvider>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/recipes/:id" element={<RecipeDetails />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/add-recipe" element={<AddRecipe />} />
                        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
                        <Route path="/my-recipes" element={<MyRecipes />} />
                        <Route path="/favorites" element={<Favorites />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>
    )
}
export default App