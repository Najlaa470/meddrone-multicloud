// app/user/help/page.tsx
export default function UserHelpPage() {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Aide & consignes</h2>
      <p className="text-xs text-slate-300">
        Utilisez cette application pour signaler uniquement les incidents réels :
        malaise, blessure, chute ou situation critique dans le stade.
      </p>

      <ul className="text-xs list-disc list-inside space-y-1 text-slate-400">
        <li>Restez calme et décrivez l’incident le plus clairement possible.</li>
        <li>Assurez-vous d’être en sécurité avant de vous approcher de la victime.</li>
        <li>Ne bloquez pas l’accès aux secours sur place.</li>
      </ul>
    </div>
  );
}
