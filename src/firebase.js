// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";           // Yeh line add hui hai
import { getFirestore } from "firebase/firestore"; // Yeh line add hui hai

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8ANNOCHdEE9Y5vg3MDd-pHZdQ-0-Yxhw",
  authDomain: "e-commerece-website-3552f.firebaseapp.com",
  projectId: "e-commerece-website-3552f",
  storageBucket: "e-commerece-website-3552f.firebasestorage.app",
  messagingSenderId: "1015828607531",
  appId: "1:1015828607531:web:4fe8e0a43b4230a85b706e",
  measurementId: "G-0QKS8EEX32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth and Firestore so other files can use them
export const auth = getAuth(app);
export const dbFirestore = getFirestore(app);