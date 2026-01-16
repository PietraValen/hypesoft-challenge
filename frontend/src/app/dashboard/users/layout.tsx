"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

/**
 * Layout específico para a rota de usuários
 * Requer autenticação e a role "admin"
 */
export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRealmRole="admin">
      <MainLayout title="Usuários">{children}</MainLayout>
    </ProtectedRoute>
  );
}
