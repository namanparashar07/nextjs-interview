// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgDFBceTLFu_ytbOGJuKJVebrNENBedzE",
  authDomain: "next-prepwise.firebaseapp.com",
  projectId: "next-prepwise",
  storageBucket: "next-prepwise.firebasestorage.app",
  messagingSenderId: "55840144490",
  appId: "1:55840144490:web:5fc6c99cd76d0e7e5b1e13",
  measurementId: "G-VYN5RXL3HW"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);