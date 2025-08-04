
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJt-4nzAipOV8v8HI2ovXyOgmAFXyxwtQ",
  authDomain: "e-commerce-app-d3de1.firebaseapp.com",
  projectId: "e-commerce-app-d3de1",
  storageBucket: "e-commerce-app-d3de1.firebasestorage.app",
  messagingSenderId: "847195457265",
  appId: "1:847195457265:web:bf22b582da49bec1b38b50",
  measurementId: "G-7MTV1HXET0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };