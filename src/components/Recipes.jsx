import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function Recipes() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("Salad") // Default search for healthy-ish options
    const [filterTime, setFilterTime] = useState("")

    useEffect(() => {
        setLoading(true)
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch recipes")
                return res.json()
            })
            .then((data) => {
                if (!data.meals) {
                    setData([])
                    setLoading(false)
                    return
                }

                const formattedRecipes = data.meals.map((meal) => {
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
                    // Using last 2 digits of ID + 15 to get range 15-114, capped or modded
                    const idNum = parseInt(meal.idMeal)
                    const timeOptions = [15, 30, 45, 60]
                    const randomTime = timeOptions[idNum % 4]

                    return {
                        id: meal.idMeal,
                        title: meal.strMeal,
                        image: meal.strMealThumb,
                        description: meal.strInstructions ? meal.strInstructions.slice(0, 100) + "..." : "No instructions available",
                        cookingTime: randomTime.toString(),
                        servings: "2", // Default
                        ingredients: ingredients.join(", ")
                    }
                })
                setData(formattedRecipes)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setError("Failed to load recipes.")
                setLoading(false)
            })
    }, [searchTerm])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    // Helper to handle search input "Enter" key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearchTerm(e.target.value)
        }
    }

    // Filter recipes based on selected time
    // If filterTime is empty, show all. Else show only recipes with cookingTime matching filterTime
    // Note: options are "15min", "30min", etc. matching "15", "30", so we need to parse.
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
                        <div key={recipe.id} className="border border-black p-2.5 rounded shadow h-fit">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded" />
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
