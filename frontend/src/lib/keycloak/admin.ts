import axios, { AxiosError } from "axios";
import { KEYCLOAK_CONFIG } from "@/lib/constants";

/**
 * Tipos para a Admin API do Keycloak
 */

/**
 * Representação de um usuário do Keycloak
 */
export interface KeycloakUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  emailVerified: boolean;
  createdTimestamp?: number;
  attributes?: Record<string, string[]>;
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
}

/**
 * DTO para criar um novo usuário
 */
export interface CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  enabled?: boolean;
  emailVerified?: boolean;
  attributes?: Record<string, string[]>;
}

/**
 * DTO para atualizar um usuário existente
 */
export interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  attributes?: Record<string, string[]>;
}

/**
 * Parâmetros para listar usuários
 */
export interface GetUsersParams {
  search?: string; // Busca por username, email, firstName ou lastName
  first?: number; // Índice do primeiro resultado (para paginação)
  max?: number; // Número máximo de resultados
  enabled?: boolean; // Filtrar por status habilitado/desabilitado
  emailVerified?: boolean; // Filtrar por verificação de email
  exact?: boolean; // Busca exata
}

/**
 * Resposta da listagem de usuários
 */
export interface GetUsersResponse {
  users: KeycloakUser[];
  total: number;
}

/**
 * DTO para redefinir senha
 */
export interface ResetPasswordDto {
  password: string;
  temporary?: boolean; // Se true, o usuário precisará alterar a senha no próximo login
}

/**
 * Erro da Admin API do Keycloak
 */
export interface KeycloakAdminError {
  error?: string;
  errorMessage?: string;
  error_description?: string;
}

/**
 * Cliente HTTP para comunicação com a Admin API do Keycloak
 */
const adminApiClient = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Constrói a URL base da Admin API do Keycloak
 */
function getAdminApiBaseUrl(): string {
  return `${KEYCLOAK_CONFIG.url}/admin/realms/${KEYCLOAK_CONFIG.realm}`;
}

/**
 * Obtém o token de acesso do usuário autenticado
 * Este token deve ter permissões de admin no Keycloak
 */
async function getAdminToken(): Promise<string> {
  // Tenta obter o token do sessionStorage (login customizado)
  if (typeof window !== "undefined") {
    const storedToken = sessionStorage.getItem("kc-access-token");
    if (storedToken) {
      return storedToken;
    }
  }

  // Se não houver token customizado, tenta obter do Keycloak JS
  // Nota: Isso requer que o Keycloak JS esteja disponível globalmente
  // ou que seja passado como parâmetro
  throw new Error(
    "Token de acesso não encontrado. É necessário estar autenticado com permissões de admin."
  );
}

/**
 * Trata erros da Admin API do Keycloak
 */
function handleAdminError(error: unknown): KeycloakAdminError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<KeycloakAdminError>;
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
    return {
      error: "network_error",
      errorMessage: axiosError.message || "Erro de rede ao comunicar com a Admin API do Keycloak",
    };
  }
  return {
    error: "unknown_error",
    errorMessage: "Erro desconhecido ao comunicar com a Admin API do Keycloak",
  };
}

/**
 * Lista usuários do Keycloak
 * 
 * @param params - Parâmetros de busca e paginação
 * @param accessToken - Token de acesso com permissões de admin (opcional, tenta obter automaticamente)
 * @returns Lista de usuários e total de resultados
 * @throws KeycloakAdminError se houver erro na requisição
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await getUsers({ search: "john", max: 10 });
 *   console.log(`Encontrados ${response.total} usuários`);
 * } catch (error) {
 *   console.error("Erro ao listar usuários:", error.errorMessage);
 * }
 * ```
 */
export async function getUsers(
  params: GetUsersParams = {},
  accessToken?: string
): Promise<GetUsersResponse> {
  try {
    const token = accessToken || (await getAdminToken());
    
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.first !== undefined) queryParams.append("first", params.first.toString());
    if (params.max !== undefined) queryParams.append("max", params.max.toString());
    if (params.enabled !== undefined) queryParams.append("enabled", params.enabled.toString());
    if (params.emailVerified !== undefined) queryParams.append("emailVerified", params.emailVerified.toString());
    if (params.exact !== undefined) queryParams.append("exact", params.exact.toString());

    const url = `${getAdminApiBaseUrl()}/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    
    const response = await adminApiClient.get<KeycloakUser[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // O Keycloak retorna um array de usuários e o total no header X-Total-Count
    const total = parseInt(response.headers["x-total-count"] || "0", 10);

    return {
      users: response.data,
      total,
    };
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}

/**
 * Obtém um usuário específico por ID
 * 
 * @param userId - ID do usuário
 * @param accessToken - Token de acesso com permissões de admin (opcional)
 * @returns Dados do usuário
 * @throws KeycloakAdminError se houver erro na requisição
 */
export async function getUserById(
  userId: string,
  accessToken?: string
): Promise<KeycloakUser> {
  try {
    const token = accessToken || (await getAdminToken());
    
    const response = await adminApiClient.get<KeycloakUser>(
      `${getAdminApiBaseUrl()}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}

/**
 * Cria um novo usuário no Keycloak
 * 
 * @param data - Dados do usuário a ser criado
 * @param accessToken - Token de acesso com permissões de admin (opcional)
 * @returns ID do usuário criado (no header Location)
 * @throws KeycloakAdminError se houver erro na requisição
 * 
 * @example
 * ```typescript
 * try {
 *   const userId = await createUser({
 *     username: "john.doe",
 *     email: "john@example.com",
 *     firstName: "John",
 *     lastName: "Doe",
 *     password: "SenhaSegura123!",
 *     enabled: true,
 *     emailVerified: false
 *   });
 *   console.log("Usuário criado com ID:", userId);
 * } catch (error) {
 *   console.error("Erro ao criar usuário:", error.errorMessage);
 * }
 * ```
 */
export async function createUser(
  data: CreateUserDto,
  accessToken?: string
): Promise<string> {
  try {
    const token = accessToken || (await getAdminToken());
    
    const userData: Partial<KeycloakUser> = {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      enabled: data.enabled ?? true,
      emailVerified: data.emailVerified ?? false,
      attributes: data.attributes,
    };

    const response = await adminApiClient.post(
      `${getAdminApiBaseUrl()}/users`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // O Keycloak retorna o ID do usuário no header Location
    const location = response.headers.location;
    if (location) {
      const userId = location.split("/").pop();
      if (userId) {
        // Após criar o usuário, define a senha
        await resetPassword(userId, { password: data.password, temporary: false }, token);
        return userId;
      }
    }

    throw new Error("Não foi possível obter o ID do usuário criado");
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}

/**
 * Atualiza um usuário existente
 * 
 * @param userId - ID do usuário a ser atualizado
 * @param data - Dados a serem atualizados
 * @param accessToken - Token de acesso com permissões de admin (opcional)
 * @returns void
 * @throws KeycloakAdminError se houver erro na requisição
 * 
 * @example
 * ```typescript
 * try {
 *   await updateUser("user-id", {
 *     firstName: "Jane",
 *     emailVerified: true
 *   });
 *   console.log("Usuário atualizado com sucesso");
 * } catch (error) {
 *   console.error("Erro ao atualizar usuário:", error.errorMessage);
 * }
 * ```
 */
export async function updateUser(
  userId: string,
  data: UpdateUserDto,
  accessToken?: string
): Promise<void> {
  try {
    const token = accessToken || (await getAdminToken());
    
    const userData: Partial<KeycloakUser> = {};
    if (data.username !== undefined) userData.username = data.username;
    if (data.email !== undefined) userData.email = data.email;
    if (data.firstName !== undefined) userData.firstName = data.firstName;
    if (data.lastName !== undefined) userData.lastName = data.lastName;
    if (data.enabled !== undefined) userData.enabled = data.enabled;
    if (data.emailVerified !== undefined) userData.emailVerified = data.emailVerified;
    if (data.attributes !== undefined) userData.attributes = data.attributes;

    await adminApiClient.put(
      `${getAdminApiBaseUrl()}/users/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}

/**
 * Exclui um usuário
 * 
 * @param userId - ID do usuário a ser excluído
 * @param accessToken - Token de acesso com permissões de admin (opcional)
 * @returns void
 * @throws KeycloakAdminError se houver erro na requisição
 * 
 * @example
 * ```typescript
 * try {
 *   await deleteUser("user-id");
 *   console.log("Usuário excluído com sucesso");
 * } catch (error) {
 *   console.error("Erro ao excluir usuário:", error.errorMessage);
 * }
 * ```
 */
export async function deleteUser(
  userId: string,
  accessToken?: string
): Promise<void> {
  try {
    const token = accessToken || (await getAdminToken());
    
    await adminApiClient.delete(
      `${getAdminApiBaseUrl()}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}

/**
 * Redefine a senha de um usuário
 * 
 * @param userId - ID do usuário
 * @param data - Dados da nova senha
 * @param accessToken - Token de acesso com permissões de admin (opcional)
 * @returns void
 * @throws KeycloakAdminError se houver erro na requisição
 * 
 * @example
 * ```typescript
 * try {
 *   await resetPassword("user-id", {
 *     password: "NovaSenhaSegura123!",
 *     temporary: false
 *   });
 *   console.log("Senha redefinida com sucesso");
 * } catch (error) {
 *   console.error("Erro ao redefinir senha:", error.errorMessage);
 * }
 * ```
 */
export async function resetPassword(
  userId: string,
  data: ResetPasswordDto,
  accessToken?: string
): Promise<void> {
  try {
    const token = accessToken || (await getAdminToken());
    
    const passwordData = {
      type: "password",
      value: data.password,
      temporary: data.temporary ?? false,
    };

    await adminApiClient.put(
      `${getAdminApiBaseUrl()}/users/${userId}/reset-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}

/**
 * Envia email de verificação para um usuário
 * 
 * @param userId - ID do usuário
 * @param accessToken - Token de acesso com permissões de admin (opcional)
 * @returns void
 * @throws KeycloakAdminError se houver erro na requisição
 * 
 * @example
 * ```typescript
 * try {
 *   await sendVerificationEmail("user-id");
 *   console.log("Email de verificação enviado");
 * } catch (error) {
 *   console.error("Erro ao enviar email:", error.errorMessage);
 * }
 * ```
 */
export async function sendVerificationEmail(
  userId: string,
  accessToken?: string
): Promise<void> {
  try {
    const token = accessToken || (await getAdminToken());
    
    // O Keycloak aceita um objeto vazio ou com parâmetros opcionais
    await adminApiClient.put(
      `${getAdminApiBaseUrl()}/users/${userId}/send-verification-email`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          client_id: KEYCLOAK_CONFIG.clientId, // Opcional: especifica o client para o email
        },
      }
    );
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}

/**
 * Obtém os roles de realm de um usuário
 * 
 * @param userId - ID do usuário
 * @param accessToken - Token de acesso com permissões de admin (opcional)
 * @returns Array de roles
 */
export async function getUserRealmRoles(
  userId: string,
  accessToken?: string
): Promise<string[]> {
  try {
    const token = accessToken || (await getAdminToken());
    
    const response = await adminApiClient.get<{ id: string; name: string }[]>(
      `${getAdminApiBaseUrl()}/users/${userId}/role-mappings/realm`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.map((role) => role.name);
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}

/**
 * Atribui roles de realm a um usuário
 * 
 * @param userId - ID do usuário
 * @param roleNames - Nomes dos roles a serem atribuídos
 * @param accessToken - Token de acesso com permissões de admin (opcional)
 * @returns void
 */
export async function assignRealmRolesToUser(
  userId: string,
  roleNames: string[],
  accessToken?: string
): Promise<void> {
  try {
    const token = accessToken || (await getAdminToken());
    
    // Primeiro, obtém os roles disponíveis no realm
    const rolesResponse = await adminApiClient.get<{ id: string; name: string }[]>(
      `${getAdminApiBaseUrl()}/roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Filtra os roles que devem ser atribuídos
    const rolesToAssign = rolesResponse.data.filter((role) =>
      roleNames.includes(role.name)
    );

    if (rolesToAssign.length === 0) {
      throw new Error("Nenhum role válido encontrado para atribuir");
    }

    // Atribui os roles ao usuário
    await adminApiClient.post(
      `${getAdminApiBaseUrl()}/users/${userId}/role-mappings/realm`,
      rolesToAssign,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    const adminError = handleAdminError(error);
    throw adminError;
  }
}
