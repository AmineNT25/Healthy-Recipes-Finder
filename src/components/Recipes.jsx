import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { db } from "../firebase"
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"

function Recipes() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("Salad") // Default search for healthy-ish options
    const [filterTime, setFilterTime] = useState("")
    const { currentUser } = useAuth()
    const [favorites, setFavorites] = useState(new Set())

    // Fetch favorites
    useEffect(() => {
        if (!currentUser) {
            setFavorites(new Set())
            return
        }

        const fetchFavorites = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users", currentUser.uid, "favorites"))
                const favIds = new Set(querySnapshot.docs.map(doc => doc.id))
                setFavorites(favIds)
            } catch (err) {
                console.error("Error fetching favorites:", err)
            }
        }
        fetchFavorites()
    }, [currentUser])

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            try {
                // Fetch from API
                const apiRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                const apiData = await apiRes.json()

                let combinedData = []

                if (apiData.meals) {
                    const formattedApiRecipes = apiData.meals.map((meal) => {
                        // Extract ingredients
                        let ingredients = []
                        for (let i = 1; i <= 20; i++) {
                            if (meal[`strIngredient${i}`]) {
                                ingredients.push(meal[`strIngredient${i}`])
                            } else {
                                break
                            }
                        }

                        // Generate a consistent random time based on the meal ID
                        const idNum = parseInt(meal.idMeal)
                        const timeOptions = [15, 30, 45, 60]
                        const randomTime = timeOptions[idNum % 4]

                        return {
                            id: meal.idMeal,
                            title: meal.strMeal,
                            image: meal.strMealThumb,
                            description: meal.strInstructions ? meal.strInstructions.slice(0, 100) + "..." : "No instructions available",
                            cookingTime: randomTime.toString(),
                            servings: "2",
                            ingredients: ingredients.join(", ")
                        }
                    })
                    combinedData = [...formattedApiRecipes]
                }

                // Fetch from Firestore
                // We only fetch all recipes from Firestore if search term is generic or empty? 
                // Or we fetch all and filter client side? 
                // For simplicity, let's fetch all "recipes" from Firestore and filter client-side by search term if simple match.
                // Or better, just fetch all from Firestore since volume is likely low for this demo.

                const querySnapshot = await getDocs(collection(db, "recipes"))
                const firestoreRecipes = querySnapshot.docs.map(doc => {
                    const d = doc.data()
                    return {
                        id: doc.id,
                        title: d.title,
                        image: d.image,
                        description: d.description,
                        cookingTime: d.cookingTime,
                        servings: d.servings,
                        ingredients: Array.isArray(d.ingredients) ? d.ingredients.join(", ") : d.ingredients
                    }
                })

                // Client-side filter for Firestore recipes based on searchTerm
                const filteredFirestore = firestoreRecipes.filter(r =>
                    r.title.toLowerCase().includes(searchTerm.toLowerCase())
                )

                combinedData = [...filteredFirestore, ...combinedData]
                setData(combinedData)
                setLoading(false)

            } catch (err) {
                console.error(err)
                setError("Failed to load recipes: " + (err.message || err))
                setLoading(false)
            }
        }

        fetchData()
    }, [searchTerm])


    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearchTerm(e.target.value)
        }
    }

    const toggleFavorite = async (recipe) => {
        if (!currentUser) {
            alert("Please log in to add favorites")
            return
        }

        const docRef = doc(db, "users", currentUser.uid, "favorites", recipe.id)

        try {
            if (favorites.has(recipe.id)) {
                await deleteDoc(docRef)
                setFavorites(prev => {
                    const newFavs = new Set(prev)
                    newFavs.delete(recipe.id)
                    return newFavs
                })
            } else {
                const recipeData = {
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    description: recipe.description
                }
                await setDoc(docRef, recipeData)
                setFavorites(prev => {
                    const newFavs = new Set(prev)
                    newFavs.add(recipe.id)
                    return newFavs
                })
            }
        } catch (err) {
            console.error("Error toggling favorite:", err)
        }
    }

    const filteredData = filterTime
        ? data.filter(recipe => parseInt(recipe.cookingTime) === parseInt(filterTime))
        : data

    if (error) {
        return <div className="text-center p-10 text-red-500">Error: {error}</div>
    }

    if (loading) {
        return <div className="text-center p-10">Loading recipes...</div>
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8 p-12 w-[70%] mx-auto h-fit">
                <h2 className="text-[2rem]">Explore our recipes, healthy recipes</h2>
                <h4 className="text-center text-base">
                    Discover quick, whole-food recipes that fit real life schedules and taste amazing.
                    Use the search bar to find a recipe by name (Press Enter to search).
                </h4>
            </div>
            <div className="flex items-center justify-between w-[92%] mx-auto">
                <select name="cookingTime" id="cookingTime" onChange={(e) => setFilterTime(e.target.value)} className="w-[20%] border border-primary bg-white p-1.5 rounded-[5px]">
                    <option value="">All</option>
                    <option value="15">15min</option>
                    <option value="30">30min</option>
                    <option value="45">45min</option>
                    <option value="60">1hour</option>
                </select>
                <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Search by name (e.g. Salad, Chicken) & Enter"
                    onKeyDown={handleKeyDown}
                    className="w-[20%] border border-primary bg-white p-1.5 rounded-[5px]"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 w-full mx-auto">
                {filteredData.length > 0 ? (
                    filteredData.map((recipe) => (
                        <div key={recipe.id} className="border border-black p-2.5 rounded shadow h-fit relative">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded" />
                            <button
                                onClick={() => toggleFavorite(recipe)}
                                className={`absolute top-4 right-4 p-2 rounded-full shadow cursor-pointer ${favorites.has(recipe.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-400'} hover:scale-110 transition-transform`}
                            >
                                ♥
                            </button>
                            <h2 className="text-xl font-bold mt-2">{recipe.title}</h2>
                            <p className="text-sm text-gray-600 mt-2">{recipe.description}</p>
                            <p className="mt-2 font-semibold">🕒 ~{recipe.cookingTime} min | 👥 {recipe.servings} servings</p>
                            <Link to={`/recipes/${recipe.id}`} className="bg-primary text-white py-2.5 px-5 rounded-[5px] inline-block mt-4 hover:opacity-80 transition-opacity duration-300">View Recipe</Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center p-10">No recipes found matching your filter.</div>
                )}
            </div>
        </div>
    )
}
export default Recipes
