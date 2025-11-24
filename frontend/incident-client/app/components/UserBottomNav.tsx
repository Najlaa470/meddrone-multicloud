// app/components/UserBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItemProps = {
  href: string;
  label: string;
  icon: string;
};

function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs ${
        active ? "text-emerald-400" : "text-slate-400"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function UserBottomNav() {
  return (
    <nav className="border-t border-slate-800 bg-slate-900/90 backdrop-blur flex">
      <NavItem href="/user" label="Accueil" icon="🏠" />
      <NavItem href="/user/report" label="Signaler" icon="🚨" />
      <NavItem href="/user/incidents" label="Mes incidents" icon="📋" />
      <NavItem href="/user/help" label="Aide" icon="❓" />
    </nav>
  );
}
