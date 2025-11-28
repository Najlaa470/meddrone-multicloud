// app/admin/services/page.tsx

type ServiceInfo = {
  nom: string;
  fournisseur: string;
  role: string;
  statut: "actif" | "degrade" | "hors_service";
  mode: "Démo" | "Pré-production" | "Production";
  indicateurs: string[];
};

const services: ServiceInfo[] = [
  {
    nom: "Réception incidents",
    fournisseur: "Azure",
    role: "Centralise les incidents et les priorise avant envoi vers les drones.",
    statut: "actif",
    mode: "Démo",
    indicateurs: [
      "Temps moyen de prise en compte : 3 s",
      "Capacité : 50 incidents/minute",
    ],
  },
  {
    nom: "Sélection du drone",
    fournisseur: "AWS",
    role: "Choisit automatiquement le drone le plus proche et disponible.",
    statut: "actif",
    mode: "Démo",
    indicateurs: [
      "Latence moyenne décision : 1,2 s",
      "Règle : distance + niveau de gravité",
    ],
  },
  {
    nom: "Simulation du vol",
    fournisseur: "Oracle Cloud",
    role: "Simule le trajet du drone et met à jour la position en temps réel.",
    statut: "actif",
    mode: "Démo",
    indicateurs: [
      "Mise à jour de position toutes les 2 s",
      "Trajectoire visible dans le dashboard (prochainement)",
    ],
  },
  {
    nom: "Historique & Analyse",
    fournisseur: "MongoDB Atlas",
    role: "Conserve l’historique des interventions pour analyse et reporting.",
    statut: "actif",
    mode: "Démo",
    indicateurs: [
      "Rétention cible : 30 jours",
      "Support de tableaux de bord décisionnels",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-5 text-sm">
      <h1 className="text-base font-semibold">Services cloud de la plateforme</h1>
      <p className="text-xs text-slate-400">
        Cette vue présente les services cloud utilisés par MedDrone, avec leur rôle
        fonctionnel et leur état. L’équipe directrice peut ainsi savoir ce qui est
        opérationnel sans entrer dans les détails techniques.
      </p>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs space-y-2">
        <h2 className="text-sm font-semibold">Chaîne fonctionnelle</h2>
        <p className="text-slate-300">
          Lorsqu’un incident est signalé par un utilisateur, il suit ce parcours :
        </p>
        <p className="mt-2 rounded-lg bg-slate-950 p-2">
          Utilisateur (application) ➜ Réception incidents (Azure) ➜ Sélection du
          drone (AWS) ➜ Simulation du vol (Oracle) ➜ Historique & Analyse (MongoDB)
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <article
            key={s.nom}
            className="rounded-xl border border-slate-800 bg-slate-900 p-3 flex flex-col gap-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">{s.nom}</h3>
                <p className="text-[11px] text-slate-400">
                  Fournisseur : {s.fournisseur}
                </p>
              </div>
              <span
                className={
                  "rounded-full px-2 py-1 text-[10px] " +
                  (s.statut === "actif"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : s.statut === "degrade"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-red-500/20 text-red-300 border border-red-500/40")
                }
              >
                {s.statut === "actif"
                  ? "Actif"
                  : s.statut === "degrade"
                  ? "Dégradé"
                  : "Hors service"}
              </span>
            </div>

            <p className="text-slate-300">{s.role}</p>

            <p className="text-[11px] text-slate-400">
              Mode d’utilisation : <b>{s.mode}</b>
            </p>

            <ul className="mt-1 list-disc list-inside space-y-1 text-[11px] text-slate-300">
              {s.indicateurs.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
