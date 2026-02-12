
import React, { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../firebase"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}


// ... (imports remain)

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    useEffect(() => {
        console.log("AuthProvider: initializing listener")
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("AuthProvider: auth state changed", user)
            setCurrentUser(user)
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role)
                    } else {
                        setUserRole("user")
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error)
                }
            } else {
                setUserRole(null)
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userRole,
        signup,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div>Loading Auth...</div> : children}
        </AuthContext.Provider>
    )
}
