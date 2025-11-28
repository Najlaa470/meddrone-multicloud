// app/user/incidents/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  DataSnapshot,
} from "firebase/database";

import { db } from "@/firebase/config";
import { useAuthGuard } from "../../hooks/useAuthGuard";

type GPS = {
  lat: number | null;
  lon: number | null;
};

type Severity = "critique" | "urgent" | "modere" | "observation";

type Incident = {
  id: string;                 // id local (on le met = firebaseId)
  firebaseId?: string;        // optionnel, pour être explicite
  type: string;
  severity: Severity | string;
  zone?: string;
  persons?: number;
  conscious?: string;
  bleeding?: string;
  doctorNearby?: string;
  stadiumAlerted?: boolean;
  description?: string;
  gps?: GPS;
  timestamp?: number;
  source?: string;
  userId?: string;
  userEmail?: string | null;
};

export default function UserIncidentsPage() {
  const router = useRouter();
  const { user, checking } = useAuthGuard();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔐 si non connecté → /auth
  useEffect(() => {
    if (!checking && !user) {
      router.replace("/auth");
    }
  }, [checking, user, router]);

  // 🔁 écoute des incidents de l'utilisateur
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // /incidents filtrés par userId
    const q = query(
      ref(db, "incidents"),
      orderByChild("userId"),
      equalTo(user.uid)
    );

    const unsubscribe = onValue(
      q,
      (snapshot: DataSnapshot) => {
        const value = snapshot.val();
        const list: Incident[] = [];

        if (value) {
          Object.entries(value).forEach(([key, raw]) => {
            const data = raw as any;
            list.push({
              id: key,
              type: data.type,
              severity: data.severity,
              zone: data.zone,
              persons: data.persons,
              conscious: data.conscious,
              bleeding: data.bleeding,
              doctorNearby: data.doctorNearby,
              stadiumAlerted: data.stadiumAlerted,
              description: data.description,
              gps: data.gps,
              timestamp: data.timestamp,
              source: data.source,
              userId: data.userId,
              userEmail: data.userEmail,
            });
          });

          // tri du plus récent au plus ancien
          list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }

        setIncidents(list);
        setLoading(false);
      },
      (err) => {
        console.error("❌ Erreur Firebase:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // clean listener
    return () => unsubscribe();
  }, [user]);

  if (checking || (!user && typeof window !== "undefined")) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-100">
        Vérification de la session...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (ts?: number) => {
    if (!ts) return "Date inconnue";
    const d = new Date(ts);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSeverity = (s: string | undefined) => {
    switch (s) {
      case "critique":
        return "Critique";
      case "urgent":
        return "Urgent";
      case "modere":
        return "Modéré";
      case "observation":
        return "Observation";
      default:
        return s || "Inconnue";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-xl mx-auto p-4 space-y-4 pb-24">
        {/* header */}
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span>Connecté : {user.email}</span>
          <span className="text-[10px] text-slate-500">Mes incidents</span>
        </div>

        <h1 className="text-lg font-semibold">Mes incidents déclarés</h1>
        <p className="text-xs text-slate-400">
          Retrouvez ici l’historique des incidents que vous avez signalés via
          l’application.
        </p>

        {loading && (
          <div className="mt-6 text-center text-xs text-slate-300">
            Chargement de vos incidents...
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
            ❌ Erreur lors de la récupération des incidents : {error}
          </div>
        )}

        {!loading && !error && incidents.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
            Vous n’avez encore signalé aucun incident.
          </div>
        )}

        {!loading && !error && incidents.length > 0 && (
          <div className="space-y-3 mt-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-100">
                    {inc.type || "Incident"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(inc.timestamp)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] mb-2">
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      inc.severity === "critique"
                        ? "bg-red-500/20 text-red-300"
                        : inc.severity === "urgent"
                        ? "bg-orange-500/20 text-orange-300"
                        : inc.severity === "modere"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    Gravité : {formatSeverity(inc.severity as string)}
                  </span>
                  {inc.zone && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
                      Zone : {inc.zone.replace("_", " ")}
                    </span>
                  )}
                  {typeof inc.persons === "number" && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
                      Personnes : {inc.persons}
                    </span>
                  )}
                </div>

                {inc.description && (
                  <p className="text-slate-200 text-[11px] mb-2">
                    {inc.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                  {inc.conscious && (
                    <p>Consciente : {inc.conscious}</p>
                  )}
                  {inc.bleeding && (
                    <p>Saignement : {inc.bleeding}</p>
                  )}
                  {inc.doctorNearby && (
                    <p>Médecin proche : {inc.doctorNearby}</p>
                  )}
                  <p>
                    Secours stade : {inc.stadiumAlerted ? "Oui" : "Non"}
                  </p>
                  {inc.gps?.lat && inc.gps?.lon && (
                    <p className="col-span-2">
                      GPS : {inc.gps.lat.toFixed(5)},{" "}
                      {inc.gps.lon.toFixed(5)}
                    </p>
                  )}
                </div>

                {inc.firebaseId && (
                  <p className="mt-1 text-[9px] text-slate-500">
                    ID Firebase : {inc.id}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
