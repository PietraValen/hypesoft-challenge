"use client";

import { useKeycloakContext } from "./provider";
import { useCallback } from "react";

/**
 * Hook principal para autenticação
 * Fornece acesso simplificado às funcionalidades do Keycloak
 */
export function useAuth() {
  const {
    keycloak,
    authenticated,
    loading,
    user,
    login,
    loginWithCredentials,
    logout,
    refreshToken,
    hasRole,
    hasRealmRole,
    hasResourceRole,
  } = useKeycloakContext();

  /**
   * Obtém o token de acesso atual
   */
  const getToken = useCallback((): string | undefined => {
    return keycloak?.token;
  }, [keycloak]);

  /**
   * Obtém o token de acesso de forma assíncrona (atualiza se necessário)
   */
  const getTokenAsync = useCallback(async (): Promise<string | undefined> => {
    if (!keycloak || !authenticated) {
      return undefined;
    }

    try {
      // Atualiza o token se estiver próximo do vencimento (menos de 30 segundos)
      await keycloak.updateToken(30);
      return keycloak.token || undefined;
    } catch (error) {
      console.error("Failed to get token", error);
      return undefined;
    }
  }, [keycloak, authenticated]);

  /**
   * Verifica se o usuário está autenticado
   */
  const isAuthenticated = authenticated && !loading;

  /**
   * Obtém informações do usuário
   */
  const userInfo = user
    ? {
        id: user.sub,
        email: user.email,
        name: user.name || user.preferred_username,
        username: user.preferred_username,
        roles: keycloak?.realmAccess?.roles || [],
        resourceRoles: keycloak?.resourceAccess || {},
      }
    : null;

  return {
    // Estado
    authenticated: isAuthenticated,
    loading,
    user: userInfo,
    keycloak,

    // Ações
    login,
    loginWithCredentials,
    logout,
    refreshToken,

    // Tokens
    getToken,
    getTokenAsync,

    // Roles
    hasRole,
    hasRealmRole,
    hasResourceRole,
  };
}

/**
 * Hook para acessar diretamente a instância do Keycloak
 * Use apenas quando precisar de funcionalidades específicas não expostas pelo useAuth
 */
export function useKeycloak() {
  const { keycloak, authenticated, loading } = useKeycloakContext();

  return {
    keycloak,
    authenticated,
    loading,
  };
}

/**
 * Hook para verificar se o usuário tem uma role específica
 */
export function useHasRole(role: string) {
  const { hasRole } = useAuth();
  return hasRole(role);
}

/**
 * Hook para verificar se o usuário tem uma realm role específica
 */
export function useHasRealmRole(role: string) {
  const { hasRealmRole } = useAuth();
  return hasRealmRole(role);
}

/**
 * Hook para verificar se o usuário tem uma resource role específica
 */
export function useHasResourceRole(role: string, resource?: string) {
  const { hasResourceRole } = useAuth();
  return hasResourceRole(role, resource);
}
