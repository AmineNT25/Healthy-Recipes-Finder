import { Link } from "react-router-dom"
import mainImg from '../assets/mainImg.png'
import secondImg from '../assets/secondImg.png'

function Home() {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center text-center">
            <div className="main flex flex-col items-center justify-center h-screen px-4">
                <h1><span>Healthy</span> meals, zero fuss</h1>
                <p className="mt-4 text-xl">Discover eight quick, whole-food recipes that you can cook tonight!</p>
                <p className="mb-8 text-gray-500">--no proccessed junk, no guesswork </p>
                <Link to="/recipes" className="button">Start Exploring</Link>
            </div>
            <img src={mainImg} alt="mainImg" className="rounded-xl shadow-lg my-10" />

            <div className="description flex flex-col items-center justify-center min-h-screen p-10">
                <h2 className="mb-10">What you'll get</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full">
                    <div className="p-4 flex flex-col items-center">
                        <h4 className="font-bold text-xl mb-2">Whole-food recipes</h4>
                        <p>Each uses everyday, unprocessed ingredients.</p>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <h4 className="font-bold text-xl mb-2">Minimum fuss</h4>
                        <p>All recipes are designed to make eating healthy, quick and easy.</p>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <h4 className="font-bold text-xl mb-2">Search in seconds</h4>
                        <p>Filter by name or ingredients and jump straight to the recipe.</p>
                    </div>
                </div>
            </div>

            <div className="article flex flex-col md:flex-row items-center justify-center min-h-[50vh] gap-10 p-10">
                <div className="flex flex-col gap-4 justify-center items-center text-center max-w-md">
                    <h2>Built for real life</h2>
                    <p>
                        Cooking shouldn’t be complicated.
                        These recipes come in under 30 minutes of active time,
                        fit busy schedules, and taste good enough to repeat.
                    </p>
                    <p>
                        Whether you’re new to the kitchen or just need fresh ideas,
                        we’ve got you covered.
                    </p>
                </div>
                <img src={secondImg} className="w-full md:w-1/2 rounded-xl" alt="secondImg" />
            </div>

            <div className="card flex flex-col items-center justify-center p-20 my-10 rounded-2xl mx-5 text-center">
                <h2 className="mb-4">Ready to cook smarter?</h2>
                <p className="mb-8">Hit the button below to get started</p>
                <Link to="/recipes" className="button">Browse recipes</Link>
            </div>
        </div>
    )
}
export default Home