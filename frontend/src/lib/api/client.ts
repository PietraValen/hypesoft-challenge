import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/constants";

/**
 * Cliente HTTP base configurado com axios
 * Inclui interceptors para adicionar tokens de autenticação
 */
let apiClient: AxiosInstance | null = null;

/**
 * Obtém uma função que retorna o token do Keycloak
 * Esta função será injetada pelo hook useAuth
 */
let getTokenFn: (() => Promise<string | undefined>) | null = null;

/**
 * Configura a função para obter o token do Keycloak
 * Deve ser chamada no início da aplicação
 */
export function setTokenGetter(fn: () => Promise<string | undefined>) {
  getTokenFn = fn;
}

/**
 * Cria e configura o cliente HTTP
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000, // 30 segundos
  });

  // Interceptor para adicionar token de autenticação
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Tenta obter o token do Keycloak
      if (getTokenFn) {
        try {
          const token = await getTokenFn();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Failed to get token for request", error);
        }
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para tratar erros de resposta
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Se receber 401 (Unauthorized), o token pode estar expirado
      if (error.response?.status === 401) {
        // Tenta atualizar o token
        if (getTokenFn) {
          try {
            await getTokenFn(); // Isso deve atualizar o token automaticamente
            // Retry a requisição original
            if (error.config) {
              return client.request(error.config);
            }
          } catch (refreshError) {
            console.error("Failed to refresh token", refreshError);
            // Redireciona para login se não conseguir atualizar
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * Obtém a instância do cliente HTTP (singleton)
 */
export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    apiClient = createApiClient();
  }
  return apiClient;
}

/**
 * Exporta o cliente HTTP configurado
 */
export const api = getApiClient();
