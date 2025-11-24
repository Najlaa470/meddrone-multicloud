"use client";

import { useState } from "react";

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
  const [status, setStatus] = useState("");
  const [loadingGps, setLoadingGps] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("❌ Géolocalisation non supportée sur cet appareil.");
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
        setStatus("✅ Position GPS récupérée.");
      },
      () => {
        setLoadingGps(false);
        setStatus("❌ Impossible de récupérer la position GPS.");
      }
    );
  };

  const validate = () => {
    if (!gps.lat || !gps.lon) {
      setStatus("⚠️ Merci de récupérer la position GPS avant d’envoyer.");
      return false;
    }
    if (!description.trim()) {
      setStatus("⚠️ Merci d’ajouter une courte description de la situation.");
      return false;
    }
    return true;
  };

  const sendIncident = () => {
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

    // 👉 Ici on mettra ensuite l’appel Firebase + Azure
    console.log("Incident prêt à être envoyé :", incident);

    setStatus(
      "✅ Incident préparé pour envoi au système (Firebase + Azure + services cloud)."
    );
  };

  const formatTypeLabel = (value: string) => {
    switch (value) {
      case "malaise_cardiaque":
        return "Malaise cardiaque / douleur thoracique";
      case "perte_connaissance":
        return "Perte de connaissance";
      case "detresse_respiratoire":
        return "Détresse respiratoire";
      case "blessure_leger":
        return "Blessure légère (entorse, coup…)";
      case "blessure_grave":
        return "Blessure grave (fracture, trauma)";
      case "chute_hauteur":
        return "Chute importante";
      case "bagarre":
        return "Bagarre / violence";
      case "fumee_incendie":
        return "Fumée / début d’incendie";
      case "autre":
        return "Autre incident";
      default:
        return value;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Formulaire de signalement avancé</h2>
      <p className="text-xs text-slate-400">
        Remplissez les informations ci-dessous pour permettre à l’équipe médicale
        et au drone de réagir le plus efficacement possible.
      </p>

      {/* Étapes visuelles */}
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300">
          1. Type & gravité
        </span>
        <span className="rounded-full bg-slate-800 px-2 py-1">
          2. Localisation & contexte
        </span>
        <span className="rounded-full bg-slate-800 px-2 py-1">
          3. Récapitulatif & envoi
        </span>
      </div>

      {/* Section 1 : Type & gravité */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
        <h3 className="text-xs font-semibold text-slate-200">
          Type d’incident et niveau de gravité
        </h3>

        {/* Type d’incident */}
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-300">
            Type d’incident
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
          >
            <option value="malaise_cardiaque">
              Malaise cardiaque / douleur thoracique
            </option>
            <option value="perte_connaissance">Perte de connaissance</option>
            <option value="detresse_respiratoire">Détresse respiratoire</option>
            <option value="blessure_leger">Blessure légère</option>
            <option value="blessure_grave">Blessure grave</option>
            <option value="chute_hauteur">Chute importante</option>
            <option value="bagarre">Bagarre / violence</option>
            <option value="fumee_incendie">Fumée / début d’incendie</option>
            <option value="autre">Autre incident</option>
          </select>
        </div>

        {/* Gravité */}
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-300">
            Gravité estimée
          </label>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setSeverity("critique")}
              className={`rounded-xl border px-2 py-2 text-left ${
                severity === "critique"
                  ? "border-red-500 bg-red-500/20 text-red-300"
                  : "border-slate-700 bg-slate-950 text-slate-300"
              }`}
            >
              🟥 Critique<br />
              <span className="text-[10px] text-slate-400">
                Danger vital immédiat
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSeverity("urgent")}
              className={`rounded-xl border px-2 py-2 text-left ${
                severity === "urgent"
                  ? "border-orange-500 bg-orange-500/20 text-orange-300"
                  : "border-slate-700 bg-slate-950 text-slate-300"
              }`}
            >
              🟧 Urgent<br />
              <span className="text-[10px] text-slate-400">
                Intervention rapide requise
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSeverity("modere")}
              className={`rounded-xl border px-2 py-2 text-left ${
                severity === "modere"
                  ? "border-amber-500 bg-amber-500/20 text-amber-300"
                  : "border-slate-700 bg-slate-950 text-slate-300"
              }`}
            >
              🟨 Modéré<br />
              <span className="text-[10px] text-slate-400">
                Stable mais à surveiller
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSeverity("observation")}
              className={`rounded-xl border px-2 py-2 text-left ${
                severity === "observation"
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-950 text-slate-300"
              }`}
            >
              🟩 Observation<br />
              <span className="text-[10px] text-slate-400">
                Incident mineur
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 2 : Localisation & contexte */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
        <h3 className="text-xs font-semibold text-slate-200">
          Localisation dans le stade & contexte
        </h3>

        {/* Zone du stade */}
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-300">
            Zone dans le stade
          </label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
          >
            <option value="tribune_centrale">Tribune centrale</option>
            <option value="virage_nord">Virage Nord</option>
            <option value="virage_sud">Virage Sud</option>
            <option value="gradins_superieurs">Gradins supérieurs</option>
            <option value="pelouse">Pelouse / bord terrain</option>
            <option value="entree_principale">Entrée principale</option>
            <option value="parking">Parking</option>
            <option value="buvette">Buvette / restauration</option>
            <option value="sanitaires">Sanitaires</option>
            <option value="autre_zone">Autre zone</option>
          </select>
        </div>

        {/* Nombre de personnes */}
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-300">
            Nombre approximatif de personnes impliquées
          </label>
          <select
            value={persons}
            onChange={(e) => setPersons(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
          >
            <option value="1">1 personne</option>
            <option value="2">2 personnes</option>
            <option value="3_5">3 à 5 personnes</option>
            <option value="6_10">6 à 10 personnes</option>
            <option value="10_plus">Plus de 10 personnes</option>
          </select>
        </div>

        {/* Infos médicales rapides */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="space-y-1">
            <p className="font-medium text-slate-300">Victime consciente ?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConscious("oui")}
                className={`flex-1 rounded-lg border px-2 py-1 ${
                  conscious === "oui"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                Oui
              </button>
              <button
                type="button"
                onClick={() => setConscious("non")}
                className={`flex-1 rounded-lg border px-2 py-1 ${
                  conscious === "non"
                    ? "border-red-500 bg-red-500/20 text-red-300"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                Non
              </button>
              <button
                type="button"
                onClick={() => setConscious("inconnu")}
                className={`flex-1 rounded-lg border px-2 py-1 ${
                  conscious === "inconnu"
                    ? "border-slate-500 bg-slate-500/20 text-slate-200"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                Inconnu
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-medium text-slate-300">Saignement visible ?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBleeding("oui")}
                className={`flex-1 rounded-lg border px-2 py-1 ${
                  bleeding === "oui"
                    ? "border-red-500 bg-red-500/20 text-red-300"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                Oui
              </button>
              <button
                type="button"
                onClick={() => setBleeding("non")}
                className={`flex-1 rounded-lg border px-2 py-1 ${
                  bleeding === "non"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                Non
              </button>
              <button
                type="button"
                onClick={() => setBleeding("inconnu")}
                className={`flex-1 rounded-lg border px-2 py-1 ${
                  bleeding === "inconnu"
                    ? "border-slate-500 bg-slate-500/20 text-slate-200"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                Inconnu
              </button>
            </div>
          </div>
        </div>

        {/* Médecin + secours */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="space-y-1">
            <p className="font-medium text-slate-300">
              Médecin / secouriste à proximité ?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDoctorNearby("oui")}
                className={`flex-1 rounded-lg border px-2 py-1 ${
                  doctorNearby === "oui"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                Oui
              </button>
              <button
                type="button"
                onClick={() => setDoctorNearby("non")}
                className={`flex-1 rounded-lg border px-2 py-1 ${
                  doctorNearby === "non"
                    ? "border-slate-500 bg-slate-500/20 text-slate-200"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                Non
              </button>
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={stadiumAlerted}
              onChange={(e) => setStadiumAlerted(e.target.checked)}
              className="h-3 w-3 rounded border-slate-600 bg-slate-950"
            />
            <span className="text-[11px] text-slate-300">
              Les secours du stade ont déjà été alertés
            </span>
          </label>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-300">
            Description détaillée
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs resize-none"
            placeholder="Ex : homme ~50 ans, se tient la poitrine, respiration difficile, tribune centrale rang 3..."
          />
        </div>
      </section>

      {/* Section 3 : GPS + récap */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
        <h3 className="text-xs font-semibold text-slate-200">
          Position GPS & récapitulatif
        </h3>

        {/* Bouton GPS */}
        <div className="space-y-1">
          <button
            onClick={getLocation}
            disabled={loadingGps}
            className="w-full rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-700 disabled:opacity-60"
          >
            {loadingGps ? "🛰️ Recherche de la position…" : "📍 Récupérer ma position GPS"}
          </button>
          <p className="text-[11px] text-slate-300">
            Latitude : {gps.lat ?? "—"} <br />
            Longitude : {gps.lon ?? "—"}
          </p>
        </div>

        {/* Récap visuel */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-200">
          <p className="font-semibold mb-1">Récapitulatif synthétique</p>
          <p>Type : {formatTypeLabel(type)}</p>
          <p>
            Gravité :{" "}
            {
              {
                critique: "Critique",
                urgent: "Urgent",
                modere: "Modéré",
                observation: "Observation",
              }[severity]
            }
          </p>
          <p>Zone : {zone.replace("_", " ")}</p>
          <p>
            Personnes impliquées :{" "}
            {
              {
                "1": "1",
                "2": "2",
                "3_5": "3 à 5",
                "6_10": "6 à 10",
                "10_plus": "Plus de 10",
              }[persons]
            }
          </p>
          <p>Victime consciente : {conscious}</p>
          <p>Saignement visible : {bleeding}</p>
          <p>Médecin à proximité : {doctorNearby}</p>
          <p>Secours déjà alertés : {stadiumAlerted ? "Oui" : "Non"}</p>
          <p className="mt-1">
            Position GPS :{" "}
            {gps.lat && gps.lon
              ? `${gps.lat.toFixed(5)}, ${gps.lon.toFixed(5)}`
              : "Non définie"}
          </p>
        </div>
      </section>

      {/* Bouton final */}
      <button
        onClick={sendIncident}
        className="w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
      >
        🚨 Envoyer l’incident au système
      </button>

      {status && <p className="text-[11px] text-slate-200">{status}</p>}
    </div>
  );
}
