
import React, { useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import { collection, addDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function AddRecipe() {
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
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)

            await addDoc(collection(db, "recipes"), {
                title: titleRef.current.value,
                description: descRef.current.value,
                instructions: instructionsRef.current.value,
                ingredients: ingredientsRef.current.value.split(',').map(i => i.trim()),
                cookingTime: timeRef.current.value,
                servings: servingsRef.current.value,
                userId: currentUser.uid,
                createdAt: new Date(),
                image: imageRef.current.value || "https://via.placeholder.com/300?text=My+Recipe",
                youtube: youtubeRef.current.value || ""
            })

            navigate("/recipes")
        } catch (e) {
            console.error("Error adding document: ", e);
            setError("Failed to add recipe")
        }

        setLoading(false)
    }

    if (!currentUser) {
        return <div className="text-center mt-10">Please log in to add a recipe.</div>
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Add a New Recipe</h2>
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
                        Add Recipe
                    </button>
                </form>
            </div>
        </div>
    )
}
