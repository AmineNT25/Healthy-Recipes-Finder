import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import mainImg from '../assets/mainImg.png'
import secondImg from '../assets/secondImg.png'

function Home() {
    const { currentUser } = useAuth()
    return (
        <div className="container mx-auto flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center h-screen px-4 gap-2.5 p-5">
                <h1 className="text-[5rem] font-panton"><span className="bg-[linear-gradient(to_top,#ffccb3_40%,transparent_40%)] px-1">Healthy</span> meals, zero fuss</h1>
                <p className="mt-4 text-xl font-light">Discover eight quick, whole-food recipes that you can cook tonight!</p>
                <p className="mb-8 text-gray-500">--no proccessed junk, no guesswork </p>
                <Link to="/recipes" className="bg-primary text-white py-2.5 px-5 rounded-[5px] hover:opacity-80 transition-opacity duration-300">Start Exploring</Link>
                {!currentUser && (
                    <div className="flex flex-col items-center gap-4 mt-8 bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-100">
                        <p className="text-lg font-medium text-gray-700">Join our community to save your favorite recipes!</p>
                        <Link to="/signup" className="bg-primary text-white py-2.5 px-8 rounded-[5px] text-lg font-bold hover:opacity-90 transition-opacity duration-300 shadow-md w-full">
                            Join
                        </Link>
                    </div>
                )}
            </div>
            <img src={mainImg} alt="mainImg" className="max-w-[1000px] mx-auto border-[10px] border-white rounded-[15px] shadow-[0_0_3px_1px_black] my-10 w-[95%]" />

            <div className="flex flex-col items-center justify-center min-h-screen gap-[50px] p-[100px]">
                <h2 className="mb-10 text-[2rem]">What you'll get</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full">
                    <div className="p-4 flex flex-col items-center">
                        <h4 className="font-bold text-base mb-2">Whole-food recipes</h4>
                        <p>Each uses everyday, unprocessed ingredients.</p>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <h4 className="font-bold text-base mb-2">Minimum fuss</h4>
                        <p>All recipes are designed to make eating healthy, quick and easy.</p>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <h4 className="font-bold text-base mb-2">Search in seconds</h4>
                        <p>Filter by name or ingredients and jump straight to the recipe.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center min-h-[50vh] gap-[50px] p-[100px]">
                <div className="flex flex-col gap-4 justify-center items-center text-center max-w-md">
                    <h2 className="text-[2rem]">Built for real life</h2>
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
                <img src={secondImg} className="w-full md:w-[40%] rounded-[15px] mx-auto shadow-none border-none" alt="secondImg" />
            </div>

            <div className="flex flex-col items-center justify-center p-[50px] gap-[50px] bg-[#d9fcf6] w-[85%] mx-auto my-[7%] rounded-2xl text-center">
                <h2 className="mb-4 text-[2rem]">Ready to cook smarter?</h2>
                <p className="mb-8">Hit the button below to get started</p>
                <Link to="/recipes" className="bg-primary text-white py-2.5 px-5 rounded-[5px] hover:opacity-80 transition-opacity duration-300">Browse recipes</Link>
            </div>
        </div>
    )
}
export default Home