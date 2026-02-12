
import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useNavigate, useParams } from "react-router-dom"

export default function EditRecipe() {
    const { id } = useParams()
    const titleRef = useRef()
    const descRef = useRef()
    const instructionsRef = useRef()
    const ingredientsRef = useRef()
    const imageRef = useRef()
    const youtubeRef = useRef()
    const timeRef = useRef()
    const servingsRef = useRef()
    const { currentUser } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const docRef = doc(db, "recipes", id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    if (currentUser && data.userId !== currentUser.uid) {
                        navigate("/") // Redirect if not owner
                    }
                    titleRef.current.value = data.title
                    descRef.current.value = data.description
                    instructionsRef.current.value = data.instructions || ""
                    ingredientsRef.current.value = Array.isArray(data.ingredients) ? data.ingredients.join(", ") : data.ingredients
                    imageRef.current.value = data.image
                    youtubeRef.current.value = data.youtube || ""
                    timeRef.current.value = data.cookingTime
                    servingsRef.current.value = data.servings
                } else {
                    setError("Recipe not found")
                }
            } catch (err) {
                console.error(err)
                setError("Failed to load recipe")
            }
            setLoading(false)
        }
        fetchRecipe()
    }, [id, currentUser, navigate])

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)

            const docRef = doc(db, "recipes", id)
            await updateDoc(docRef, {
                title: titleRef.current.value,
                description: descRef.current.value,
                instructions: instructionsRef.current.value,
                ingredients: ingredientsRef.current.value.split(',').map(i => i.trim()),
                cookingTime: timeRef.current.value,
                servings: servingsRef.current.value,
                image: imageRef.current.value || "https://via.placeholder.com/300?text=My+Recipe",
                youtube: youtubeRef.current.value || ""
            })

            navigate("/my-recipes")
        } catch (e) {
            console.error("Error updating document: ", e);
            setError("Failed to update recipe")
        }

        setLoading(false)
    }

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>
    }

    if (!currentUser) {
        return <div className="text-center mt-10">Please log in to edit this recipe.</div>
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Recipe</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Recipe Title</label>
                        <input
                            type="text"
                            ref={titleRef}
                            required
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            ref={descRef}
                            required
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
                        <textarea
                            ref={instructionsRef}
                            required
                            placeholder="Step-by-step instructions..."
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary h-32"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                        <input
                            type="url"
                            ref={imageRef}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">YouTube Video URL</label>
                        <input
                            type="url"
                            ref={youtubeRef}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients (comma separated)</label>
                        <textarea
                            ref={ingredientsRef}
                            required
                            placeholder="e.g. Chicken, Salt, Pepper"
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="flex gap-4 mb-6">
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Time (mins)</label>
                            <input
                                type="number"
                                ref={timeRef}
                                required
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Servings</label>
                            <input
                                type="number"
                                ref={servingsRef}
                                required
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition duration-300"
                    >
                        Update Recipe
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/my-recipes")}
                        className="w-full mt-2 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-opacity-90 transition duration-300"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}
