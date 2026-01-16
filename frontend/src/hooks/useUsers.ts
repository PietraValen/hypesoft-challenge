import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  sendVerificationEmail,
  getUserRealmRoles,
  type GetUsersParams,
  type CreateUserDto as KeycloakCreateUserDto,
  type UpdateUserDto as KeycloakUpdateUserDto,
  type ResetPasswordDto,
  type KeycloakUser,
} from "@/lib/keycloak/admin";
import { useToast } from "@/hooks/use-toast";
import { User, CreateUserDto, UpdateUserDto } from "@/types/auth";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Converte um KeycloakUser para o formato User usado no frontend
 */
function convertKeycloakUserToUser(keycloakUser: KeycloakUser, roles: string[] = []): User {
  return {
    id: keycloakUser.id,
    username: keycloakUser.username,
    email: keycloakUser.email || "",
    firstName: keycloakUser.firstName,
    lastName: keycloakUser.lastName,
    enabled: keycloakUser.enabled,
    emailVerified: keycloakUser.emailVerified,
    createdAt: keycloakUser.createdTimestamp
      ? new Date(keycloakUser.createdTimestamp).toISOString()
      : new Date().toISOString(),
    roles,
  };
}

/**
 * Obtém o token de acesso do Keycloak
 */
async function getAccessToken(): Promise<string> {
  // Tenta obter do sessionStorage (login customizado)
  if (typeof window !== "undefined") {
    const storedToken = sessionStorage.getItem("kc-access-token");
    if (storedToken) {
      return storedToken;
    }
  }

  // Se não houver token customizado, tenta obter do Keycloak JS
  // Isso requer que o Keycloak esteja disponível globalmente
  throw new Error(
    "Token de acesso não encontrado. É necessário estar autenticado com permissões de admin."
  );
}

/**
 * Hook para listar usuários com paginação e filtros
 * 
 * @param params - Parâmetros de busca, paginação e filtros
 * @returns Query result com lista de usuários e total
 */
export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const token = await getAccessToken();
      const response = await getUsers(params, token);
      
      // Para cada usuário, obtém os roles
      const usersWithRoles = await Promise.all(
        response.users.map(async (keycloakUser) => {
          try {
            const roles = await getUserRealmRoles(keycloakUser.id, token);
            return convertKeycloakUserToUser(keycloakUser, roles);
          } catch (error) {
            // Se houver erro ao obter roles, retorna o usuário sem roles
            console.warn(`Falha ao obter roles do usuário ${keycloakUser.id}:`, error);
            return convertKeycloakUserToUser(keycloakUser, []);
          }
        })
      );

      return {
        users: usersWithRoles,
        total: response.total,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obter um usuário específico por ID
 * 
 * @param userId - ID do usuário
 * @returns Query result com dados do usuário
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: async () => {
      if (!userId) {
        throw new Error("ID do usuário é obrigatório");
      }
      
      const token = await getAccessToken();
      const keycloakUser = await getUserById(userId, token);
      
      // Obtém os roles do usuário
      let roles: string[] = [];
      try {
        roles = await getUserRealmRoles(userId, token);
      } catch (error) {
        console.warn(`Falha ao obter roles do usuário ${userId}:`, error);
      }
      
      return convertKeycloakUserToUser(keycloakUser, roles);
    },
    enabled: !!userId,
  });
}

/**
 * Hook para criar um novo usuário
 * 
 * @returns Mutation para criar usuário
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const token = await getAccessToken();
      
      // Converte CreateUserDto para KeycloakCreateUserDto
      const keycloakData: KeycloakCreateUserDto = {
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        enabled: data.enabled ?? true,
        emailVerified: data.emailVerified ?? false,
      };
      
      const userId = await createUser(keycloakData, token);
      
      // Retorna o usuário criado
      const keycloakUser = await getUserById(userId, token);
      let roles: string[] = [];
      try {
        roles = await getUserRealmRoles(userId, token);
      } catch (error) {
        console.warn(`Falha ao obter roles do usuário ${userId}:`, error);
      }
      
      return convertKeycloakUserToUser(keycloakUser, roles);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
      });
    },
    onError: (error: Error | { errorMessage?: string; error?: string }) => {
      const errorMessage =
        (error as { errorMessage?: string })?.errorMessage ||
        (error instanceof Error ? error.message : undefined) ||
        "Falha ao criar usuário";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para atualizar um usuário existente
 * 
 * @returns Mutation para atualizar usuário
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }) => {
      const token = await getAccessToken();
      
      // Converte UpdateUserDto para KeycloakUpdateUserDto
      const keycloakData: KeycloakUpdateUserDto = {
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        enabled: data.enabled,
        emailVerified: data.emailVerified,
      };
      
      await updateUser(id, keycloakData, token);
      
      // Retorna o usuário atualizado
      const keycloakUser = await getUserById(id, token);
      let roles: string[] = [];
      try {
        roles = await getUserRealmRoles(id, token);
      } catch (error) {
        console.warn(`Falha ao obter roles do usuário ${id}:`, error);
      }
      
      return convertKeycloakUserToUser(keycloakUser, roles);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
      });
    },
    onError: (error: Error | { errorMessage?: string; error?: string }) => {
      const errorMessage =
        (error as { errorMessage?: string })?.errorMessage ||
        (error instanceof Error ? error.message : undefined) ||
        "Falha ao atualizar usuário";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para excluir um usuário
 * 
 * @returns Mutation para excluir usuário
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      await deleteUser(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
      });
    },
    onError: (error: Error | { errorMessage?: string; error?: string }) => {
      const errorMessage =
        (error as { errorMessage?: string })?.errorMessage ||
        (error instanceof Error ? error.message : undefined) ||
        "Falha ao excluir usuário";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para redefinir a senha de um usuário
 * 
 * @returns Mutation para redefinir senha
 */
export function useResetPassword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: ResetPasswordDto }) => {
      const token = await getAccessToken();
      await resetPassword(userId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Sucesso",
        description: "Senha redefinida com sucesso!",
      });
    },
    onError: (error: Error | { errorMessage?: string; error?: string }) => {
      const errorMessage =
        (error as { errorMessage?: string })?.errorMessage ||
        (error instanceof Error ? error.message : undefined) ||
        "Falha ao redefinir senha";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para enviar email de verificação para um usuário
 * 
 * @returns Mutation para enviar email de verificação
 */
export function useSendVerificationEmail() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const token = await getAccessToken();
      await sendVerificationEmail(userId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Sucesso",
        description: "Email de verificação enviado com sucesso!",
      });
    },
    onError: (error: Error | { errorMessage?: string; error?: string }) => {
      const errorMessage =
        (error as { errorMessage?: string })?.errorMessage ||
        (error instanceof Error ? error.message : undefined) ||
        "Falha ao enviar email de verificação";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}