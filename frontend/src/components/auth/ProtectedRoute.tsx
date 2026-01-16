"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/keycloak/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRealmRole?: string;
  requiredResourceRole?: { role: string; resource?: string };
}

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para login se o usuário não estiver autenticado
 */
export function ProtectedRoute({
  children,
  requiredRole,
  requiredRealmRole,
  requiredResourceRole,
}: ProtectedRouteProps) {
  const { authenticated, loading, hasRole, hasRealmRole, hasResourceRole } =
    useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Aguarda o carregamento inicial
    if (loading) {
      return;
    }

    // Verifica autenticação
    if (!authenticated) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // Verifica roles se necessário
    if (requiredRole && !hasRole(requiredRole)) {
      router.push("/unauthorized");
      return;
    }

    if (requiredRealmRole && !hasRealmRole(requiredRealmRole)) {
      router.push("/unauthorized");
      return;
    }

    if (
      requiredResourceRole &&
      !hasResourceRole(
        requiredResourceRole.role,
        requiredResourceRole.resource
      )
    ) {
      router.push("/unauthorized");
      return;
    }
  }, [
    authenticated,
    loading,
    requiredRole,
    requiredRealmRole,
    requiredResourceRole,
    hasRole,
    hasRealmRole,
    hasResourceRole,
    router,
    pathname,
  ]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Não renderiza nada se não estiver autenticado (será redirecionado)
  if (!authenticated) {
    return null;
  }

  // Verifica roles antes de renderizar
  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  if (requiredRealmRole && !hasRealmRole(requiredRealmRole)) {
    return null;
  }

  if (
    requiredResourceRole &&
    !hasResourceRole(requiredResourceRole.role, requiredResourceRole.resource)
  ) {
    return null;
  }

  return <>{children}</>;
}
