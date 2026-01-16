"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/keycloak/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginContent() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    // Se já estiver autenticado, redireciona
    if (authenticated && !loading) {
      const redirectPath = redirect || "/dashboard";
      router.push(redirectPath);
    }
  }, [authenticated, loading, redirect, router]);

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

  const handleLoginSuccess = () => {
    const redirectPath = redirect || "/dashboard";
    router.push(redirectPath);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            ShopSense Dashboard
          </CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar o sistema de gestão de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={handleLoginSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
