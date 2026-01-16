"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import Keycloak, { KeycloakTokenParsed } from "keycloak-js";
import { initKeycloak, keycloakInitOptions } from "./config";
import { setTokenGetter } from "@/lib/api/client";
import { login as keycloakLogin, getUserInfo, refreshToken as refreshTokenApi, type LoginCredentials, type AuthError } from "@/lib/api/auth";

interface KeycloakContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  loading: boolean;
  user: KeycloakTokenParsed | null;
  error: string | null;
  login: () => void;
  loginWithCredentials: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  hasRole: (role: string) => boolean;
  hasRealmRole: (role: string) => boolean;
  hasResourceRole: (role: string, resource?: string) => boolean;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(
  undefined
);

interface KeycloakProviderProps {
  children: React.ReactNode;
}

export function KeycloakProvider({ children }: KeycloakProviderProps) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<KeycloakTokenParsed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCustomAuth, setIsCustomAuth] = useState(false); // Flag para login customizado

  useEffect(() => {
    // Inicializa o Keycloak apenas no cliente
    if (typeof window === "undefined") {
      return;
    }

    const keycloakInstance = initKeycloak();

    keycloakInstance
      .init(keycloakInitOptions)
      .then(async (authenticated) => {
        setKeycloak(keycloakInstance);
        setAuthenticated(authenticated);
        setUser(keycloakInstance.tokenParsed || null);

        // Configura o cliente API para usar o token do Keycloak
        // Verifica primeiro se há tokens customizados no sessionStorage
        const customToken = typeof window !== "undefined" 
          ? sessionStorage.getItem("kc-access-token") 
          : null;
        
        if (customToken) {
          // Se há token customizado, usa ele
          setIsCustomAuth(true);
          setAuthenticated(true);
          
          // Tenta obter informações do usuário do token
          try {
            const userInfo = await getUserInfo(customToken);
            setUser(userInfo as KeycloakTokenParsed);
          } catch (error) {
            console.error("Failed to get user info from custom token", error);
            // Se o token for inválido, limpa o storage
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("kc-access-token");
              sessionStorage.removeItem("kc-refresh-token");
            }
            // Reverte o estado de autenticação
            setIsCustomAuth(false);
            setAuthenticated(authenticated); // Volta ao estado original do Keycloak
          }
        }
        
        // Configura o tokenGetter que funciona tanto com Keycloak JS quanto com tokens customizados
        setTokenGetter(async () => {
          try {
            // Primeiro, verifica se há token customizado
            if (typeof window !== "undefined") {
              const storedToken = sessionStorage.getItem("kc-access-token");
              if (storedToken) {
                // Verifica se o token está próximo de expirar e tenta renovar
                try {
                  const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
                  const expirationTime = tokenData.exp * 1000; // Converte para ms
                  const now = Date.now();
                  const timeUntilExpiry = expirationTime - now;
                  
                  // Se o token expirar em menos de 30 segundos, tenta renovar
                  if (timeUntilExpiry < 30000) {
                    const refreshToken = sessionStorage.getItem("kc-refresh-token");
                    if (refreshToken) {
                      try {
                        const newTokenResponse = await refreshTokenApi(refreshToken);
                        sessionStorage.setItem("kc-access-token", newTokenResponse.access_token);
                        if (newTokenResponse.refresh_token) {
                          sessionStorage.setItem("kc-refresh-token", newTokenResponse.refresh_token);
                        }
                        // Atualiza informações do usuário
                        const userInfo = await getUserInfo(newTokenResponse.access_token);
                        setUser(userInfo as KeycloakTokenParsed);
                        return newTokenResponse.access_token;
                      } catch (refreshError) {
                        console.error("Failed to refresh custom token", refreshError);
                        // Se não conseguir renovar, limpa o storage
                        sessionStorage.removeItem("kc-access-token");
                        sessionStorage.removeItem("kc-refresh-token");
                        setAuthenticated(false);
                        setUser(null);
                        setIsCustomAuth(false);
                        return undefined;
                      }
                    }
                  }
                } catch (parseError) {
                  // Se não conseguir parsear o token, retorna o token armazenado mesmo assim
                }
                
                return storedToken;
              }
            }
            
            // Se não há token customizado, usa o Keycloak JS
            if (keycloakInstance.authenticated) {
              await keycloakInstance.updateToken(30);
              return keycloakInstance.token || undefined;
            }
            return undefined;
          } catch (error) {
            console.error("Failed to get token", error);
            return undefined;
          }
        });

        // Configura refresh automático do token
        if (authenticated) {
          keycloakInstance.onTokenExpired = () => {
            keycloakInstance
              .updateToken(30)
              .then((refreshed) => {
                if (refreshed) {
                  console.log("Token refreshed");
                }
              })
              .catch(() => {
                console.error("Failed to refresh token");
                keycloakInstance.logout();
              });
          };
        }
      })
      .catch((error) => {
        console.error("Failed to initialize Keycloak", error);
        // Captura o erro para exibir na UI
        const errorMessage = error?.error_description || error?.error || error?.message || "Erro desconhecido";
        setError(errorMessage);
        
        // Se o erro for "Client not found", mostra mensagem mais clara
        if (error?.error === "invalid_client" || error?.error_description?.includes("Client not found")) {
          console.error(
            "❌ Keycloak Client não encontrado!\n" +
            "Por favor, configure o Keycloak seguindo o guia em KEYCLOAK_QUICK_SETUP.md\n" +
            "Você precisa:\n" +
            "1. Criar o realm 'hypesoft'\n" +
            "2. Criar o client 'hypesoft-frontend' como Public Client\n" +
            "3. Configurar as URLs de redirecionamento"
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // Event listeners do Keycloak
    keycloakInstance.onAuthSuccess = () => {
      setAuthenticated(true);
      setUser(keycloakInstance.tokenParsed || null);
    };

    keycloakInstance.onAuthError = () => {
      setAuthenticated(false);
      setUser(null);
    };

    keycloakInstance.onAuthLogout = () => {
      setAuthenticated(false);
      setUser(null);
      setIsCustomAuth(false);
      // Limpa tokens customizados do sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("kc-access-token");
        sessionStorage.removeItem("kc-refresh-token");
      }
    };

    keycloakInstance.onTokenExpired = () => {
      keycloakInstance
        .updateToken(30)
        .then((refreshed) => {
          if (refreshed) {
            console.log("Token refreshed automatically");
          }
        })
        .catch(() => {
          console.error("Failed to refresh expired token");
        });
    };

    // Cleanup
    return () => {
      keycloakInstance.onAuthSuccess = undefined;
      keycloakInstance.onAuthError = undefined;
      keycloakInstance.onAuthLogout = undefined;
      keycloakInstance.onTokenExpired = undefined;
    };
  }, []);

  const login = useCallback(() => {
    if (keycloak) {
      keycloak.login();
    }
  }, [keycloak]);

  /**
   * Realiza login usando credenciais diretamente via API REST do Keycloak
   * Isso permite login customizado sem redirecionamento
   * 
   * @param credentials - Credenciais de login (username e password)
   * @throws AuthError se as credenciais forem inválidas
   */
  const loginWithCredentials = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        // Realiza login via API REST do Keycloak
        const tokenResponse = await keycloakLogin(credentials);

        // Obtém informações do usuário
        const userInfo = await getUserInfo(tokenResponse.access_token);

        // Armazena os tokens no sessionStorage para uso imediato
        if (typeof window !== "undefined") {
          sessionStorage.setItem("kc-access-token", tokenResponse.access_token);
          if (tokenResponse.refresh_token) {
            sessionStorage.setItem("kc-refresh-token", tokenResponse.refresh_token);
          }

          // Configura o tokenGetter para usar o token obtido diretamente
          // Isso permite que as requisições API funcionem imediatamente
          setTokenGetter(async () => {
            try {
              // Primeiro, tenta usar o token armazenado
              const storedToken = sessionStorage.getItem("kc-access-token");
              if (storedToken) {
                // Verifica se o token está próximo de expirar e tenta renovar
                try {
                  const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
                  const expirationTime = tokenData.exp * 1000; // Converte para ms
                  const now = Date.now();
                  const timeUntilExpiry = expirationTime - now;
                  
                  // Se o token expirar em menos de 30 segundos, tenta renovar
                  if (timeUntilExpiry < 30000) {
                    const refreshToken = sessionStorage.getItem("kc-refresh-token");
                    if (refreshToken) {
                      try {
                        const newTokenResponse = await refreshTokenApi(refreshToken);
                        sessionStorage.setItem("kc-access-token", newTokenResponse.access_token);
                        if (newTokenResponse.refresh_token) {
                          sessionStorage.setItem("kc-refresh-token", newTokenResponse.refresh_token);
                        }
                        // Atualiza informações do usuário
                        const userInfo = await getUserInfo(newTokenResponse.access_token);
                        setUser(userInfo as KeycloakTokenParsed);
                        return newTokenResponse.access_token;
                      } catch (refreshError) {
                        console.error("Failed to refresh custom token", refreshError);
                        // Se não conseguir renovar, limpa o storage
                        sessionStorage.removeItem("kc-access-token");
                        sessionStorage.removeItem("kc-refresh-token");
                        setAuthenticated(false);
                        setUser(null);
                        setIsCustomAuth(false);
                        return undefined;
                      }
                    }
                  }
                } catch (parseError) {
                  // Se não conseguir parsear o token, retorna o token armazenado mesmo assim
                }
                
                return storedToken;
              }

              // Se não houver token armazenado, tenta usar o Keycloak JS
              if (keycloak?.authenticated) {
                try {
                  await keycloak.updateToken(30);
                  return keycloak.token || undefined;
                } catch (error) {
                  console.error("Failed to get token from Keycloak", error);
                  return undefined;
                }
              }

              return undefined;
            } catch (error) {
              console.error("Failed to get token", error);
              return undefined;
            }
          });
        }

        // Atualiza o estado do provider com as informações do usuário
        setAuthenticated(true);
        setUser(userInfo as KeycloakTokenParsed);
        setIsCustomAuth(true);
        setError(null);
      } catch (error) {
        const authError = error as AuthError;
        const errorMessage = authError.error_description || authError.error || "Erro ao fazer login";
        setError(errorMessage);
        setAuthenticated(false);
        setUser(null);
        setIsCustomAuth(false);
        // Limpa tokens em caso de erro
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("kc-access-token");
          sessionStorage.removeItem("kc-refresh-token");
        }
        throw authError;
      } finally {
        setLoading(false);
      }
    },
    [keycloak]
  );

  const logout = useCallback(() => {
    // Se for login customizado, limpa os tokens do sessionStorage
    if (isCustomAuth && typeof window !== "undefined") {
      const refreshToken = sessionStorage.getItem("kc-refresh-token");
      
      // Tenta invalidar o refresh token no Keycloak (opcional, não bloqueia o logout)
      if (refreshToken) {
        // Nota: A função logout da API auth.ts pode ser usada aqui se necessário
        // Por enquanto, apenas limpa o storage local
        sessionStorage.removeItem("kc-access-token");
        sessionStorage.removeItem("kc-refresh-token");
      }
      
      // Atualiza o estado
      setAuthenticated(false);
      setUser(null);
      setIsCustomAuth(false);
      setError(null);
    }
    
    // Se houver instância do Keycloak JS, faz logout tradicional
    if (keycloak) {
      keycloak.logout();
    }
  }, [keycloak, isCustomAuth]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!authenticated) {
      return false;
    }

    try {
      // Se for login customizado, usa a API REST para renovar
      if (isCustomAuth && typeof window !== "undefined") {
        const refreshTokenValue = sessionStorage.getItem("kc-refresh-token");
        if (refreshTokenValue) {
          try {
            const newTokenResponse = await refreshTokenApi(refreshTokenValue);
            sessionStorage.setItem("kc-access-token", newTokenResponse.access_token);
            if (newTokenResponse.refresh_token) {
              sessionStorage.setItem("kc-refresh-token", newTokenResponse.refresh_token);
            }
            // Atualiza informações do usuário
            const userInfo = await getUserInfo(newTokenResponse.access_token);
            setUser(userInfo as KeycloakTokenParsed);
            return true;
          } catch (error) {
            console.error("Failed to refresh custom token", error);
            // Se não conseguir renovar, limpa o storage
            sessionStorage.removeItem("kc-access-token");
            sessionStorage.removeItem("kc-refresh-token");
            setAuthenticated(false);
            setUser(null);
            setIsCustomAuth(false);
            return false;
          }
        }
        return false;
      }
      
      // Se for login tradicional, usa o Keycloak JS
      if (keycloak) {
        const refreshed = await keycloak.updateToken(30);
        return refreshed;
      }
      
      return false;
    } catch (error) {
      console.error("Failed to refresh token", error);
      return false;
    }
  }, [keycloak, authenticated, isCustomAuth]);

  const hasRole = useCallback(
    (role: string): boolean => {
      if (!authenticated) {
        return false;
      }
      
      // Se for login customizado, verifica roles do token parseado
      if (isCustomAuth && user) {
        const realmRoles = user.realm_access?.roles || [];
        const resourceRoles: string[] = [];
        
        if (user.resource_access) {
          Object.values(user.resource_access).forEach((access) => {
            if (access.roles) {
              resourceRoles.push(...access.roles);
            }
          });
        }
        
        return realmRoles.includes(role) || resourceRoles.includes(role);
      }
      
      // Se for login tradicional, usa o Keycloak JS
      if (keycloak) {
        return keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role);
      }
      
      return false;
    },
    [keycloak, authenticated, isCustomAuth, user]
  );

  const hasRealmRole = useCallback(
    (role: string): boolean => {
      if (!authenticated) {
        return false;
      }
      
      // Se for login customizado, verifica realm roles do token parseado
      if (isCustomAuth && user) {
        const realmRoles = user.realm_access?.roles || [];
        return realmRoles.includes(role);
      }
      
      // Se for login tradicional, usa o Keycloak JS
      if (keycloak) {
        return keycloak.hasRealmRole(role);
      }
      
      return false;
    },
    [keycloak, authenticated, isCustomAuth, user]
  );

  const hasResourceRole = useCallback(
    (role: string, resource?: string): boolean => {
      if (!authenticated) {
        return false;
      }
      
      // Se for login customizado, verifica resource roles do token parseado
      if (isCustomAuth && user) {
        if (!user.resource_access) {
          return false;
        }
        
        if (resource) {
          const access = user.resource_access[resource];
          return access?.roles?.includes(role) || false;
        }
        
        // Se não especificar resource, verifica em todos
        return Object.values(user.resource_access).some((access) =>
          access.roles?.includes(role)
        );
      }
      
      // Se for login tradicional, usa o Keycloak JS
      if (keycloak) {
        return keycloak.hasResourceRole(role, resource);
      }
      
      return false;
    },
    [keycloak, authenticated, isCustomAuth, user]
  );

  const value: KeycloakContextType & { error: string | null } = {
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
    error,
  };

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
}

/**
 * Hook para acessar o contexto do Keycloak
 * @throws Error se usado fora do KeycloakProvider
 */
export function useKeycloakContext(): KeycloakContextType {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error("useKeycloakContext must be used within KeycloakProvider");
  }
  return context;
}
