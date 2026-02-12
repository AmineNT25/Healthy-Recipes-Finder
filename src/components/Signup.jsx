
import React, { useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()



    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        try {
            setError("")
            setLoading(true)
            const cred = await signup(emailRef.current.value, passwordRef.current.value)

            // Assign 'admin' role if email matches (or other logic)
            // Ideally this should be done via Cloud Functions for security
            // But for this client-side demo:
            const role = emailRef.current.value === "admin@recipefinder.com" ? "admin" : "user"

            await setDoc(doc(db, "users", cred.user.uid), {
                email: emailRef.current.value,
                role: role,
                createdAt: new Date()
            })

            navigate("/")
        } catch (err) {
            console.error(err)
            setError("Failed to create an account: " + err.message)
        }

        setLoading(false)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
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
                    <div className="mb-4">
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
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password Confirmation</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                ref={passwordConfirmRef}
                                required
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-primary pr-10 font-sans"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-primary focus:outline-none"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="w-full text-center mt-4">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    )
}
