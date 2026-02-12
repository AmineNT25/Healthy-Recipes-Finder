import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

const RecipeDetails = () => {
    const { id } = useParams()
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const { currentUser, userRole } = useAuth()
    const [isFavorite, setIsFavorite] = useState(false)
    const [rating, setRating] = useState(0)
    const navigate = useNavigate()

    // ... (useEffect fetches)

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await deleteDoc(doc(db, "recipes", id))
                navigate("/recipes")
            } catch (error) {
                console.error("Error deleting recipe:", error)
                alert("Failed to delete recipe")
            }
        }
    }

    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true)
            // Check if ID is numeric (API) or string (Firestore)
            const isApiId = /^\d+$/.test(id)

            if (isApiId) {
                try {
                    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
                    const data = await res.json()
                    if (data.meals) {
                        setRecipe(data.meals[0])
                    }
                } catch (err) {
                    console.error(err)
                }
            } else {
                // Fetch from Firestore
                try {
                    const docRef = doc(db, "recipes", id)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        setRecipe({ id: docSnap.id, ...docSnap.data() })
                    }
                } catch (err) {
                    console.error(err)
                }
            }
            setLoading(false)
        }

        fetchRecipe()
    }, [id])

    useEffect(() => {
        if (!currentUser) return

        const checkFavorite = async () => {
            const docRef = doc(db, "users", currentUser.uid, "favorites", id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setIsFavorite(true)
            }
        }
        checkFavorite()
    }, [id, currentUser])




    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true)
            // Check if ID is numeric (API) or string (Firestore)
            const isApiId = /^\d+$/.test(id)

            if (isApiId) {
                try {
                    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
                    const data = await res.json()
                    if (data.meals) {
                        setRecipe(data.meals[0])
                    }
                } catch (err) {
                    console.error(err)
                }
            } else {
                // Fetch from Firestore
                try {
                    const docRef = doc(db, "recipes", id)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        setRecipe({ id: docSnap.id, ...docSnap.data() })
                    }
                } catch (err) {
                    console.error(err)
                }
            }
            setLoading(false)
        }

        fetchRecipe()
    }, [id])

    useEffect(() => {
        if (!currentUser) return

        const checkFavorite = async () => {
            const docRef = doc(db, "users", currentUser.uid, "favorites", id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setIsFavorite(true)
            }
        }
        checkFavorite()
    }, [id, currentUser])

    const toggleFavorite = async () => {
        if (!currentUser) {
            alert("Please log in to add favorites")
            return
        }

        const docRef = doc(db, "users", currentUser.uid, "favorites", id)
        if (isFavorite) {
            await deleteDoc(docRef)
            setIsFavorite(false)
        } else {
            // Save a snapshot of the recipe to favorites
            // We need to normalize data structure a bit if it's from API
            const recipeData = {
                id: id,
                title: recipe.strMeal || recipe.title,
                image: recipe.strMealThumb || recipe.image,
                description: recipe.strInstructions ? recipe.strInstructions.slice(0, 100) + "..." : recipe.description
            }
            await setDoc(docRef, recipeData)
            setIsFavorite(true)
        }
    }



    if (loading) return <div className="text-center p-10">Loading...</div>
    if (!recipe) return <div className="text-center p-10">Recipe not found</div>

    // Helper to get ingredients (handles both API structure and Firestore structure safely)
    const getIngredients = () => {
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
            return recipe.ingredients
        }
        const ingredients = []
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`]
            const measure = recipe[`strMeasure${i}`]
            if (ingredient && ingredient.trim() !== "") {
                ingredients.push(`${measure} ${ingredient}`)
            }
        }
        return ingredients
    }

    const ingredients = getIngredients()
    // const instructions = recipe.strInstructions || recipe.description || "No instructions available."
    const title = recipe.strMeal || recipe.title
    const image = recipe.strMealThumb || recipe.image
    const category = recipe.strCategory || "Custom"
    const area = recipe.strArea || "World"
    const youtube = recipe.strYoutube || recipe.youtube

    return (
        <div className="container mx-auto p-5 max-w-4xl flex flex-col gap-[50px] mb-[50px]">
            <Link to="/recipes" className="bg-primary text-white py-2.5 px-5 rounded-[5px] mb-5 inline-block w-fit hover:opacity-80 transition-opacity duration-300">&larr; Back to Recipes</Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-5 gap-[50px] flex flex-col w-full">
                <div className="relative">
                    <img src={image} alt={title} className="w-full h-80 object-cover" />
                    <button
                        onClick={toggleFavorite}
                        className={`absolute top-4 right-4 p-3 rounded-full shadow-lg ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400'} hover:scale-110 transition-transform`}
                    >
                        ♥
                    </button>
                    {(userRole === 'admin' || (currentUser && recipe.userId === currentUser.uid)) && (
                        <button
                            onClick={handleDelete}
                            className="absolute top-4 left-4 bg-red-600 text-white p-2 rounded shadow hover:bg-red-700 transition-colors"
                        >
                            Delete Recipe
                        </button>
                    )}
                </div>

                <div className="p-8">
                    <h2 className="text-4xl font-bold mb-4">{title}</h2>
                    <div className="flex gap-4 mb-6 text-sm text-gray-600">
                        <span className="font-semibold bg-green-100 px-3 py-1 rounded">Category: {category}</span>
                        <span className="font-semibold bg-blue-100 px-3 py-1 rounded">Area: {area}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2.5 h-fit text-xs">
                        <div>
                            <h4 className="text-2xl font-bold mb-3">Ingredients</h4>
                            <ul className="list-disc pl-5 space-y-2 text-base">
                                {ingredients.map((ing, index) => (
                                    <li key={index}>{ing}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-2xl font-bold mb-3">Description</h4>
                            <p className="whitespace-pre-line leading-relaxed text-gray-700 text-base mb-6">
                                {recipe.description || <span className="italic text-gray-500">No description provided.</span>}
                            </p>

                            <h4 className="text-2xl font-bold mb-3">Instructions</h4>
                            <p className="whitespace-pre-line leading-relaxed text-gray-700 text-base">
                                {recipe.instructions || recipe.description || "No instructions available."}
                            </p>
                        </div>
                    </div>

                    {youtube && (
                        <div className="mt-8 flex flex-col gap-[10px] w-fit items-center justify-center mx-auto mb-5 bg-white p-[10px] border border-primary rounded-[5px]">
                            <h4 className="text-2xl font-bold mb-3">Video Tutorial</h4>
                            <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-white bg-red-600 p-[10px] rounded-[5px] m-[10px] hover:underline">
                                Watch on YouTube
                            </a>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default RecipeDetails
