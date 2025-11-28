import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjYz_PS9CAjggZiyB0dkdfRhLLk3b1cXs",
  authDomain: "drone-704c3.firebaseapp.com",
  databaseURL: "https://drone-704c3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "drone-704c3",
  storageBucket: "drone-704c3.firebasestorage.app",
  messagingSenderId: "193935421512",
  appId: "1:193935421512:web:1dd5c402b297e6d8b5e87d",
  measurementId: "G-BE22ZBMYJM"
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
