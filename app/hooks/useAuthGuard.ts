// app/hooks/useAuthGuard.ts
"use client";

import { useEffect, useState } from "react";
import { listenAuth } from "../../firebase/auth"; // garde bien ce chemin
import { useRouter } from "next/navigation";

export const useAuthGuard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);   // ✅ user: any
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = listenAuth((u: any) => { // ✅ u: any
      setUser(u);
      setChecking(false);

      if (!u) {
        router.replace("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user, checking }; // ✅ user sera de type "any"
};
