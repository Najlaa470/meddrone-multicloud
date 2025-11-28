"use client";

import { useState } from "react";
import { login } from "@/firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Connexion réussie !");
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("Erreur inconnue");
      }
    }
  };

  return (
    <div className="p-6">
      <h1>Connexion</h1>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mb-2 block"
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Mot de passe"
        className="border p-2 mb-2 block"
      />

      <button
        onClick={handleLogin}
        className="bg-emerald-500 text-white px-4 py-2 rounded"
      >
        Se connecter
      </button>
    </div>
  );
}
