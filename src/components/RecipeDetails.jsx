import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const RecipeDetails = () => {
    const { id } = useParams()
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.meals) {
                    setRecipe(data.meals[0])
                }
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [id])

    if (loading) return <div className="text-center p-10">Loading...</div>
    if (!recipe) return <div className="text-center p-10">Recipe not found</div>

    // Extract ingredients and measures
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`]
        const measure = recipe[`strMeasure${i}`]
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(`${measure} ${ingredient}`)
        }
    }

    return (
        <div className="container mx-auto p-5 max-w-4xl recipeDetails">
            <Link to="/recipes" className="button mb-5 inline-block" id='button'>&larr; Back to Recipes</Link>

            <div className="recipeContainer bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-80 object-cover" />

                <div className="p-8">
                    <h2 className="text-4xl font-bold mb-4">{recipe.strMeal}</h2>
                    <div className="flex gap-4 mb-6 text-sm text-gray-600">
                        <span className="font-semibold bg-green-100 px-3 py-1 rounded">Category: {recipe.strCategory}</span>
                        <span className="font-semibold bg-blue-100 px-3 py-1 rounded">Area: {recipe.strArea}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 whatToDo">
                        <div>
                            <h4 className="text-2xl font-bold mb-3 ingredients">Ingredients</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                {ingredients.map((ing, index) => (
                                    <li key={index}>{ing}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-2xl font-bold mb-3 instructions">Instructions</h4>
                            <p className="whitespace-pre-line leading-relaxed text-gray-700">
                                {recipe.strInstructions}
                            </p>
                        </div>
                    </div>

                    {recipe.strYoutube && (
                        <div className="mt-8 tutorial">
                            <h4 className="text-2xl font-bold mb-3">Video Tutorial</h4>
                            <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline youtube">
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
