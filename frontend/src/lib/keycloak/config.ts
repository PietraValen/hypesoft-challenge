import Keycloak from "keycloak-js";

/**
 * Configuração do Keycloak
 * Lê as variáveis de ambiente para configurar a instância do Keycloak
 */
export const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "hypesoft",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "hypesoft-frontend",
};

/**
 * Inicializa a instância do Keycloak
 */
export const initKeycloak = (): Keycloak => {
  return new Keycloak({
    url: keycloakConfig.url,
    realm: keycloakConfig.realm,
    clientId: keycloakConfig.clientId,
  });
};

/**
 * Opções de inicialização do Keycloak
 */
export const keycloakInitOptions: Keycloak.KeycloakInitOptions = {
  onLoad: "check-sso", // Verifica SSO silenciosamente
  silentCheckSsoRedirectUri:
    typeof window !== "undefined"
      ? `${window.location.origin}/silent-check-sso.html`
      : undefined,
  pkceMethod: "S256", // Usa PKCE para segurança adicional
  checkLoginIframe: false, // Desabilita iframe check para evitar problemas
  enableLogging: process.env.NODE_ENV === "development",
};
