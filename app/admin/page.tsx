// app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div className="space-y-4 text-sm">
      <h1 className="text-base font-semibold">Dashboard global</h1>
      <p className="text-xs text-slate-400">
        Synthèse des incidents, des drones et de l’état des services cloud.
      </p>

      {/* KPIs */}
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <p className="text-xs text-slate-400">Incidents du jour</p>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <p className="text-xs text-slate-400">Drones actifs</p>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <p className="text-xs text-slate-400">Services opérationnels</p>
          <p className="mt-2 text-2xl font-bold">5/5</p>
        </div>
      </section>

      {/* Pipeline multi-cloud */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Pipeline multi-cloud</h2>
        <p className="text-xs text-slate-400">
          Visualisation simplifiée du trajet d’un incident dans le système.
        </p>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs">
          Utilisateur ➜ Firebase ➜ Azure ➜ AWS ➜ Oracle VM ➜ MongoDB / Dashboard
        </div>
      </section>
    </div>
  );
}
