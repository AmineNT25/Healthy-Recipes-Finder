
import React, { useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch (err) {
            setError("Failed to log in: " + (err.message || err))
        }

        setLoading(false)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            ref={emailRef}
                            required
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                ref={passwordRef}
                                required
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary pr-10 font-sans"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-primary focus:outline-none"
                            >
                                {showPassword ? (
                                    <span>Hide</span>
                                ) : (
                                    <span>Show</span>
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition duration-300"
                    >
                        Log In
                    </button>
                </form>
                <div className="w-full text-center mt-4">
                    Need an account? <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}
