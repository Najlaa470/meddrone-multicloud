"use client";

import { useState } from "react";
import { push, ref } from "firebase/database";
// adapte le chemin si nécessaire : "../../firebase/config" si "@" ne marche pas
import { db } from "@/firebase/config";

type GPS = {
  lat: number | null;
  lon: number | null;
};

type Severity = "critique" | "urgent" | "modere" | "observation";

export default function ReportIncident() {
  const [type, setType] = useState("malaise_cardiaque");
  const [severity, setSeverity] = useState<Severity>("urgent");
  const [zone, setZone] = useState("tribune_centrale");
  const [persons, setPersons] = useState("1");
  const [conscious, setConscious] = useState("inconnu");
  const [bleeding, setBleeding] = useState("inconnu");
  const [doctorNearby, setDoctorNearby] = useState("non");
  const [stadiumAlerted, setStadiumAlerted] = useState(false);
  const [description, setDescription] = useState("");
  const [gps, setGps] = useState<GPS>({ lat: null, lon: null });
  const [loadingGps, setLoadingGps] = useState(false);
  const [status, setStatus] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("❌ Géolocalisation non supportée.");
      return;
    }

    setLoadingGps(true);
    setStatus("🛰️ Récupération de la position GPS…");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setLoadingGps(false);
        setStatus("✅ Localisation récupérée.");
      },
      () => {
        setLoadingGps(false);
        setStatus("❌ Impossible de récupérer la position GPS.");
      }
    );
  };

  const validate = () => {
    if (!gps.lat || !gps.lon) {
      setStatus("⚠️ Merci de récupérer la position GPS.");
      return false;
    }
    if (!description.trim()) {
      setStatus("⚠️ Merci d’ajouter une description.");
      return false;
    }
    return true;
  };

  const sendIncident = async () => {
    if (!validate()) return;

    const incident = {
      type,
      severity,
      zone,
      persons: Number(persons),
      conscious,
      bleeding,
      doctorNearby,
      stadiumAlerted,
      description,
      gps,
      timestamp: Date.now(),
      source: "mobile_supporter",
    };

    try {
      setStatus("🔄 Envoi vers Firebase…");

      // 1️⃣ Envoi Firebase
      const firebaseRef = await push(ref(db, "incidents"), incident);
      console.log("✅ Firebase ID:", firebaseRef.key);

      setStatus("🔄 Envoi vers Azure…");

      // 2️⃣ Envoi Azure - AUTOMATIQUE depuis le frontend
      const azureResponse = await fetch(
        "https://fa-urgence-drones-hde5dwf2cdapcyfe.francecentral-01.azurewebsites.net/api/newIncident",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...incident,
            firebaseId: firebaseRef.key,
          }),
        }
      );

      if (!azureResponse.ok) {
        const errorData = await azureResponse.json();
        console.error("❌ Erreur Azure:", errorData);
        throw new Error(errorData.error || `HTTP ${azureResponse.status}`);
      }

      const azureResult = await azureResponse.json();
      console.log("✅ Azure:", azureResult);

      setStatus(`✅ Incident envoyé ! Azure ID: ${azureResult.incidentId}`);

      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setType("malaise_cardiaque");
        setSeverity("urgent");
        setZone("tribune_centrale");
        setPersons("1");
        setConscious("inconnu");
        setBleeding("inconnu");
        setDoctorNearby("non");
        setStadiumAlerted(false);
        setDescription("");
        setGps({ lat: null, lon: null });
        setStatus("");
      }, 3000);
    } catch (e: any) {
      console.error("❌ Erreur:", e);
      setStatus("❌ Erreur : " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Formulaire de signalement avancé</h2>

      {/* TYPE D’INCIDENT */}
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-300">Type d’incident</h3>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded bg-slate-800 p-2"
        >
          <option value="malaise_cardiaque">Malaise cardiaque</option>
          <option value="perte_connaissance">Perte de connaissance</option>
          <option value="detresse_respiratoire">Détresse respiratoire</option>
          <option value="blessure_grave">Blessure grave</option>
          <option value="bagarre">Bagarre</option>
          <option value="fumee_incendie">Fumée / incendie</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      {/* GRAVITÉ */}
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-300">Gravité</h3>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as Severity)}
          className="w-full rounded bg-slate-800 p-2"
        >
          <option value="critique">Critique</option>
          <option value="urgent">Urgent</option>
          <option value="modere">Modéré</option>
          <option value="observation">Observation</option>
        </select>
      </div>

      {/* ZONE */}
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-300">Zone</h3>
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="w-full rounded bg-slate-800 p-2"
        >
          <option value="tribune_centrale">Tribune centrale</option>
          <option value="tribune_nord">Tribune nord</option>
          <option value="tribune_sud">Tribune sud</option>
          <option value="terrain">Terrain</option>
          <option value="exterieur">Extérieur du stade</option>
        </select>
      </div>

      {/* NOMBRE DE PERSONNES */}
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-300">Nombre de personnes</h3>
        <input
          type="number"
          min="1"
          className="w-full rounded bg-slate-800 p-2"
          value={persons}
          onChange={(e) => setPersons(e.target.value)}
        />
      </div>

      {/* ÉTAT DE LA VICTIME */}
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-300">Victime consciente ?</h3>
        <select
          value={conscious}
          onChange={(e) => setConscious(e.target.value)}
          className="w-full rounded bg-slate-800 p-2"
        >
          <option value="oui">Oui</option>
          <option value="non">Non</option>
          <option value="inconnu">Inconnu</option>
        </select>
      </div>

      {/* HÉMORRAGIE */}
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-300">Hémorragie ?</h3>
        <select
          value={bleeding}
          onChange={(e) => setBleeding(e.target.value)}
          className="w-full rounded bg-slate-800 p-2"
        >
          <option value="oui">Oui</option>
          <option value="non">Non</option>
          <option value="inconnu">Inconnu</option>
        </select>
      </div>

      {/* MÉDECIN PROCHE */}
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-300">Médecin proche ?</h3>
        <select
          value={doctorNearby}
          onChange={(e) => setDoctorNearby(e.target.value)}
          className="w-full rounded bg-slate-800 p-2"
        >
          <option value="oui">Oui</option>
          <option value="non">Non</option>
        </select>
      </div>

      {/* ALERTE STADE */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={stadiumAlerted}
          onChange={(e) => setStadiumAlerted(e.target.checked)}
        />
        <label>Alerte déjà donnée au stade</label>
      </div>

      {/* DESCRIPTION */}
      <div>
        <h3 className="font-semibold text-slate-300">Description détaillée</h3>
        <textarea
          className="w-full rounded bg-slate-800 p-2"
          placeholder="Décris précisément l’incident…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* GPS */}
      <button
        onClick={getLocation}
        className="rounded bg-blue-500 px-3 py-2 text-white"
      >
        {loadingGps ? "⏳ GPS…" : "📡 Récupérer GPS"}
      </button>

      {/* ENVOI */}
      <button
        onClick={sendIncident}
        className="w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
      >
        🚨 Envoyer l’incident
      </button>

      {status && <p className="text-[11px] text-slate-200">{status}</p>}
    </div>
  );
}
