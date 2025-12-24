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
        <div className="container mx-auto p-5 max-w-4xl flex flex-col gap-[50px] mb-[50px]">
            <Link to="/recipes" className="bg-primary text-white py-2.5 px-5 rounded-[5px] mb-5 inline-block w-fit hover:opacity-80 transition-opacity duration-300">&larr; Back to Recipes</Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-5 gap-[50px] flex flex-col w-full">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-80 object-cover" />

                <div className="p-8">
                    <h2 className="text-4xl font-bold mb-4">{recipe.strMeal}</h2>
                    <div className="flex gap-4 mb-6 text-sm text-gray-600">
                        <span className="font-semibold bg-green-100 px-3 py-1 rounded">Category: {recipe.strCategory}</span>
                        <span className="font-semibold bg-blue-100 px-3 py-1 rounded">Area: {recipe.strArea}</span>
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
                            <h4 className="text-2xl font-bold mb-3">Instructions</h4>
                            <p className="whitespace-pre-line leading-relaxed text-gray-700 text-base">
                                {recipe.strInstructions}
                            </p>
                        </div>
                    </div>

                    {recipe.strYoutube && (
                        <div className="mt-8 flex flex-col gap-[10px] w-fit items-center justify-center mx-auto mb-5 bg-white p-[10px] border border-primary rounded-[5px]">
                            <h4 className="text-2xl font-bold mb-3">Video Tutorial</h4>
                            <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="text-white bg-red-600 p-[10px] rounded-[5px] m-[10px] hover:underline">
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
