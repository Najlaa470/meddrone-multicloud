// app/user/page.tsx
import Link from "next/link";

export default function UserHome() {
  return (
    <div className="space-y-4">
      {/* Bloc principal */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-4">
        <p className="text-xs uppercase tracking-wide text-emerald-400">
          Urgences médicales
        </p>
        <h2 className="mt-1 text-sm font-semibold">
          Signaler un incident en quelques secondes
        </h2>
        <p className="mt-2 text-xs text-slate-200">
          Dès que vous observez un malaise, une blessure ou une chute, déclarez-le
          via cette application pour déclencher l’intervention d’un drone médical.
        </p>

        <Link
          href="/user/report"
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          🚨 Signaler un incident
        </Link>
      </section>

      {/* Incidents récents (mock pour l’instant) */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Mes derniers incidents</h3>
        <p className="text-xs text-slate-400">
          Cette section affichera vos derniers signalements (connectée à Firebase
          plus tard).
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-300">
          Aucun incident déclaré pour le moment.
        </div>
      </section>

      {/* Infos système */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">État du système</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <p className="text-slate-400">Connexion</p>
            <p className="mt-1 font-semibold text-emerald-400">Opérationnelle</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <p className="text-slate-400">Drone disponible</p>
            <p className="mt-1 font-semibold">Oui (simulation)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
