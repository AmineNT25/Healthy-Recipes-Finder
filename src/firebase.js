// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCebTTLJYwa4QSw3GRoxB4SBijlGKW8YOE",
    authDomain: "healthy-recipe-finder-660e9.firebaseapp.com",
    projectId: "healthy-recipe-finder-660e9",
    storageBucket: "healthy-recipe-finder-660e9.firebasestorage.app",
    messagingSenderId: "640458490103",
    appId: "1:640458490103:web:28c97b6c8774f5292793f2",
    measurementId: "G-TXRX6NM8RP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);