// app/auth/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, login } from "../../firebase/auth";

const ADMIN_EMAIL = "admin@gmail.com"; // 👈 email admin

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("⏳ Traitement en cours...");

    try {
      if (mode === "signup") {
        await signup(email, password);
        setStatus("✅ Compte créé avec succès.");
      } else {
        await login(email, password);
        setStatus("✅ Connexion réussie.");
      }

      // 🔀 REDIRECTION SELON LE TYPE D'UTILISATEUR
      if (email === ADMIN_EMAIL) {
        router.push("/admin");   // 👉 équipe médicale
      } else {
        router.push("/user");    // 👉 utilisateur normal
      }
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Erreur : " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-sm bg-slate-900/70 rounded-xl p-6 space-y-4 border border-slate-700">
        <h1 className="text-xl font-bold text-center">
          {mode === "login" ? "Connexion" : "Inscription"} MedDrone
        </h1>

        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md px-3 py-2 border ${
              mode === "login"
                ? "bg-emerald-500 text-slate-900 border-emerald-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md px-3 py-2 border ${
              mode === "signup"
                ? "bg-emerald-500 text-slate-900 border-emerald-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            Créer un compte
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1 text-sm">
            <label className="block text-slate-200">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-md bg-slate-800 px-3 py-2 outline-none border border-slate-700 focus:border-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label className="block text-slate-200">Mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-md bg-slate-800 px-3 py-2 outline-none border border-slate-700 focus:border-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <p className="text-[11px] text-slate-400">
              Minimum 6 caractères (règle Firebase).
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
          >
            {mode === "login" ? "Se connecter" : "Créer un compte"}
          </button>
        </form>

        {status && (
          <p className="text-[11px] text-slate-300 min-h-[16px]">{status}</p>
        )}
      </div>
    </div>
  );
}
