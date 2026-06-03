// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const auth = getAuth(app);
export const dbFirestore = getFirestore(app);