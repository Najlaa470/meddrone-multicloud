// app/user/incidents/page.tsx
export default function UserIncidentsPage() {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Mes incidents</h2>
      <p className="text-xs text-slate-400">
        Cette page affichera l’historique de vos signalements à partir de Firebase.
      </p>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-300">
        Aucun incident trouvé pour le moment.
      </div>
    </div>
  );
}
