// app/user/layout.tsx
import type { ReactNode } from "react";
import UserBottomNav from "../components/UserBottomNav";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col border-x border-slate-800 bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-4 py-3 bg-slate-900/90">
        <h1 className="font-semibold text-base">MedDrone – Utilisateur</h1>
        <p className="text-xs text-slate-400">
          Signalez rapidement un incident dans le stade.
        </p>
      </header>

      {/* Contenu */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">{children}</main>

      {/* Navigation bas */}
      <UserBottomNav />
    </div>
  );
}
