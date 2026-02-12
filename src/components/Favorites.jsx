
import React, { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Link } from "react-router-dom"

export default function Favorites() {
    const { currentUser } = useAuth()
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!currentUser) {
            setLoading(false)
            return
        }

        async function fetchFavorites() {
            try {
                // Assuming we store favorites in a subcollection 'favorites' under the user document
                // Path: users/{uid}/favorites/{recipeId}
                const q = query(collection(db, "users", currentUser.uid, "favorites"))
                const querySnapshot = await getDocs(q)
                const favs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setFavorites(favs)
            } catch (error) {
                console.error("Error fetching favorites:", error)
            }
            setLoading(false)
        }

        fetchFavorites()
    }, [currentUser])

    const handleRemove = async (id) => {
        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "favorites", id))
            setFavorites(prev => prev.filter(recipe => recipe.id !== id))
        } catch (error) {
            console.error("Error removing favorite:", error)
        }
    }

    if (!currentUser) {
        return <div className="text-center mt-10">Please log in to view favorites.</div>
    }

    if (loading) {
        return <div className="text-center mt-10">Loading favorites...</div>
    }

    return (
        <div className="container mx-auto p-5">
            <h2 className="text-3xl font-bold text-center mb-8">My Favorites</h2>
            {favorites.length === 0 ? (
                <div className="text-center">You haven't added any favorites yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {favorites.map(recipe => (
                        <div key={recipe.id} className="border border-black p-2.5 rounded shadow h-fit relative">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded" />
                            <h2 className="text-xl font-bold mt-2">{recipe.title}</h2>
                            <Link to={`/recipes/${recipe.id}`} className="bg-primary text-white py-2.5 px-5 rounded-[5px] inline-block mt-4 hover:opacity-80 transition-opacity duration-300">View Recipe</Link>
                            <button
                                onClick={() => handleRemove(recipe.id)}
                                className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-2 hover:bg-red-100 transition-colors"
                                title="Remove from favorites"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
