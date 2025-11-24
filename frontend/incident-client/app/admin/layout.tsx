// app/admin/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-slate-800 bg-slate-950/95 p-4 text-sm">
        <h2 className="text-base font-semibold mb-4">MedDrone – Direction</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block hover:text-emerald-400">
            📊 Tableau de bord
          </Link>
          <Link href="/admin/incidents" className="block hover:text-emerald-400">
            📋 Incidents
          </Link>
          <Link href="/admin/drone" className="block hover:text-emerald-400">
            🚁 Suivi de la flotte de drones
          </Link>
          <Link href="/admin/config" className="block hover:text-emerald-400">
            ⚙️ Paramétrage de la plateforme
          </Link>
        </nav>
      </aside>

      {/* Contenu */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-slate-800 bg-slate-900/90 px-4 py-3">
          <p className="text-xs text-slate-400">
            Vue équipe directrice – supervision du système MedDrone.
          </p>
        </header>
        <main className="flex-1 px-4 py-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
