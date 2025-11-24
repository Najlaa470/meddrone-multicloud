// app/admin/incidents/page.tsx
export default function AdminIncidentsPage() {
  return (
    <div className="space-y-3 text-sm">
      <h1 className="text-base font-semibold">Incidents</h1>
      <p className="text-xs text-slate-400">
        Cette page affichera la liste détaillée des incidents (source Firebase / MongoDB).
      </p>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs">
        <p>Aucun incident n’a encore été enregistré.</p>
      </div>
    </div>
  );
}
