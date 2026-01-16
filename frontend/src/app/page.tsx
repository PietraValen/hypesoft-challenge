"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/keycloak/hooks";

export default function Home() {
  const router = useRouter();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (authenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [authenticated, loading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shopSense-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    </main>
  );
}
