
import React, { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Link } from "react-router-dom"

export default function MyRecipes() {
    const { currentUser } = useAuth()
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!currentUser) {
            setLoading(false)
            return
        }

        async function fetchMyRecipes() {
            try {
                const q = query(collection(db, "recipes"), where("userId", "==", currentUser.uid))
                const querySnapshot = await getDocs(q)
                const myRecipes = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setRecipes(myRecipes)
            } catch (error) {
                console.error("Error fetching my recipes:", error)
            }
            setLoading(false)
        }

        fetchMyRecipes()
    }, [currentUser])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await deleteDoc(doc(db, "recipes", id))
                setRecipes(prev => prev.filter(recipe => recipe.id !== id))
            } catch (error) {
                console.error("Error deleting recipe:", error)
                alert("Failed to delete recipe")
            }
        }
    }

    if (!currentUser) {
        return <div className="text-center mt-10">Please log in to view your recipes.</div>
    }

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>
    }

    return (
        <div className="container mx-auto p-5">
            <h2 className="text-3xl font-bold text-center mb-8">My Added Recipes</h2>
            {recipes.length === 0 ? (
                <div className="text-center">
                    <p>You haven't added any recipes yet.</p>
                    <Link to="/add-recipe" className="text-primary hover:underline mt-4 inline-block">Add your first recipe</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recipes.map(recipe => (
                        <div key={recipe.id} className="border border-black p-2.5 rounded shadow h-fit relative">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded" />
                            <h2 className="text-xl font-bold mt-2">{recipe.title}</h2>
                            <p className="text-sm text-gray-600 mt-2">{recipe.description.substring(0, 100)}...</p>

                            <div className="flex gap-2 mt-4">
                                <Link to={`/recipes/${recipe.id}`} className="bg-primary text-white py-2 px-4 rounded text-sm hover:opacity-80 transition-opacity">View</Link>
                                <Link to={`/edit-recipe/${recipe.id}`} className="bg-yellow-500 text-white py-2 px-4 rounded text-sm hover:bg-yellow-600 transition-colors">Update</Link>
                                <button
                                    onClick={() => handleDelete(recipe.id)}
                                    className="bg-red-500 text-white py-2 px-4 rounded text-sm hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
