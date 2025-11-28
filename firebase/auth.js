// firebase/auth.js (ou auth.ts si ton projet est déjà en TypeScript)
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";

// 🔹 Inscription
export const signup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};



// 🔹 Connexion
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🔹 Déconnexion
export const logout = () => {
  return signOut(auth);
};

// 🔹 Écouteur de changement d'état (connecté / pas connecté)
export const listenAuth = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};