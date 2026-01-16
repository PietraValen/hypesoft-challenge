"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/keycloak/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterRequestForm } from "@/components/auth/RegisterRequestForm";

function RegisterContent() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se já estiver autenticado, redireciona para o dashboard
    if (authenticated && !loading) {
      router.push("/dashboard");
    }
  }, [authenticated, loading, router]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Se já estiver autenticado, não mostra nada (será redirecionado)
  if (authenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Solicitar Acesso
          </CardTitle>
          <CardDescription className="text-center">
            Preencha o formulário abaixo para solicitar acesso ao ShopSense Dashboard.
            Você receberá um email quando sua conta for aprovada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
