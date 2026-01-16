import axios, { AxiosError } from "axios";
import { KEYCLOAK_CONFIG } from "@/lib/constants";

/**
 * Tipos de resposta da API de autenticação do Keycloak
 */
export interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token?: string;
  scope?: string;
}

export interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name?: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthError {
  error: string;
  error_description?: string;
  error_uri?: string;
}

/**
 * Cliente HTTP para comunicação com APIs REST do Keycloak
 */
const keycloakApiClient = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

/**
 * Constrói a URL base do Keycloak
 */
function getKeycloakBaseUrl(): string {
  return `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}`;
}

/**
 * Constrói a URL do token endpoint
 */
function getTokenEndpoint(): string {
  return `${getKeycloakBaseUrl()}/protocol/openid-connect/token`;
}

/**
 * Constrói a URL do userinfo endpoint
 */
function getUserInfoEndpoint(): string {
  return `${getKeycloakBaseUrl()}/protocol/openid-connect/userinfo`;
}

/**
 * Constrói a URL do logout endpoint
 */
function getLogoutEndpoint(): string {
  return `${getKeycloakBaseUrl()}/protocol/openid-connect/logout`;
}

/**
 * Converte um objeto em formato URL-encoded
 */
function urlEncode(data: Record<string, string>): string {
  return Object.keys(data)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    )
    .join("&");
}

/**
 * Trata erros da API do Keycloak
 */
function handleKeycloakError(error: unknown): AuthError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<AuthError>;
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
    return {
      error: "network_error",
      error_description: axiosError.message || "Erro de rede ao comunicar com o Keycloak",
    };
  }
  return {
    error: "unknown_error",
    error_description: "Erro desconhecido ao autenticar",
  };
}

/**
 * Realiza login usando grant_type=password (Direct Access Grants)
 * 
 * @param credentials - Credenciais de login (username e password)
 * @returns Resposta com tokens de acesso e refresh
 * @throws AuthError se as credenciais forem inválidas ou houver erro na autenticação
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await login({ username: "user@example.com", password: "senha123" });
 *   console.log("Access token:", response.access_token);
 * } catch (error) {
 *   console.error("Erro no login:", error.error_description);
 * }
 * ```
 */
export async function login(
  credentials: LoginCredentials
): Promise<KeycloakTokenResponse> {
  try {
    const data = urlEncode({
      grant_type: "password",
      client_id: KEYCLOAK_CONFIG.clientId,
      username: credentials.username,
      password: credentials.password,
      scope: "openid profile email", // Escopos necessários para acessar userinfo
    });

    const response = await keycloakApiClient.post<KeycloakTokenResponse>(
      getTokenEndpoint(),
      data
    );

    return response.data;
  } catch (error) {
    const authError = handleKeycloakError(error);
    throw authError;
  }
}

/**
 * Renova o token de acesso usando o refresh token
 * 
 * @param refreshToken - Token de refresh obtido no login
 * @returns Nova resposta com tokens atualizados
 * @throws AuthError se o refresh token for inválido ou expirado
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await refreshToken(refreshToken);
 *   console.log("Novo access token:", response.access_token);
 * } catch (error) {
 *   console.error("Erro ao renovar token:", error.error_description);
 * }
 * ```
 */
export async function refreshToken(
  refreshToken: string
): Promise<KeycloakTokenResponse> {
  try {
    const data = urlEncode({
      grant_type: "refresh_token",
      client_id: KEYCLOAK_CONFIG.clientId,
      refresh_token: refreshToken,
      scope: "openid profile email", // Mantém os escopos ao renovar o token
    });

    const response = await keycloakApiClient.post<KeycloakTokenResponse>(
      getTokenEndpoint(),
      data
    );

    return response.data;
  } catch (error) {
    const authError = handleKeycloakError(error);
    throw authError;
  }
}

/**
 * Realiza logout invalidando o refresh token
 * 
 * @param refreshToken - Token de refresh a ser invalidado
 * @returns void
 * @throws AuthError se houver erro ao fazer logout
 * 
 * @example
 * ```typescript
 * try {
 *   await logout(refreshToken);
 *   console.log("Logout realizado com sucesso");
 * } catch (error) {
 *   console.error("Erro ao fazer logout:", error.error_description);
 * }
 * ```
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    const data = urlEncode({
      client_id: KEYCLOAK_CONFIG.clientId,
      refresh_token: refreshToken,
    });

    await keycloakApiClient.post(getLogoutEndpoint(), data);
  } catch (error) {
    const authError = handleKeycloakError(error);
    throw authError;
  }
}

/**
 * Obtém informações do usuário autenticado
 * 
 * @param accessToken - Token de acesso obtido no login
 * @returns Informações do usuário (sub, email, nome, roles, etc.)
 * @throws AuthError se o token for inválido ou expirado
 * 
 * @example
 * ```typescript
 * try {
 *   const userInfo = await getUserInfo(accessToken);
 *   console.log("Usuário:", userInfo.preferred_username);
 *   console.log("Email:", userInfo.email);
 * } catch (error) {
 *   console.error("Erro ao obter informações do usuário:", error.error_description);
 * }
 * ```
 */
export async function getUserInfo(
  accessToken: string
): Promise<KeycloakUserInfo> {
  try {
    const response = await keycloakApiClient.get<KeycloakUserInfo>(
      getUserInfoEndpoint(),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const authError = handleKeycloakError(error);
    throw authError;
  }
}

/**
 * Solicitação de cadastro (opcional)
 * Esta função pode ser usada para enviar uma solicitação de cadastro.
 * Por padrão, o Keycloak não permite registro público, então esta função
 * pode ser implementada para enviar dados para um backend que processa
 * a solicitação via Admin API.
 * 
 * @param data - Dados da solicitação de cadastro
 * @returns void
 * 
 * @example
 * ```typescript
 * await registerRequest({
 *   email: "user@example.com",
 *   firstName: "João",
 *   lastName: "Silva",
 *   username: "joao.silva",
 *   message: "Solicito acesso ao sistema"
 * });
 * ```
 */
export interface RegisterRequestData {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  message?: string;
}

export async function registerRequest(
  data: RegisterRequestData
): Promise<void> {
  // Esta função envia a solicitação para um endpoint do backend
  // que processa via Admin API do Keycloak
  // Por enquanto, simula o envio (pode ser conectado a um endpoint real depois)
  try {
    // TODO: Conectar a um endpoint real do backend quando disponível
    // const response = await api.post('/api/auth/register-request', data);
    
    // Simulação: apenas retorna sucesso
    // Em produção, isso deve ser substituído por uma chamada real ao backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Se houver um endpoint no backend, descomente e use:
    // const { api } = await import('./client');
    // await api.post('/api/auth/register-request', data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw {
        error: "registration_error",
        error_description: axiosError.response?.data?.message || "Erro ao enviar solicitação de cadastro",
      } as AuthError;
    }
    throw {
      error: "unknown_error",
      error_description: "Erro desconhecido ao enviar solicitação de cadastro",
    } as AuthError;
  }
}
