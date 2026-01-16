/**
 * Tipos TypeScript para autenticação e gerenciamento de usuários
 * 
 * Este arquivo define os tipos principais usados em toda a aplicação
 * para autenticação e gerenciamento de usuários.
 */

/**
 * Credenciais de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Dados para solicitação de cadastro
 */
export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  message?: string;
}

/**
 * Representação de um usuário no sistema
 */
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  roles: string[];
}

/**
 * DTO para criação de um novo usuário
 */
export interface CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  enabled?: boolean;
  emailVerified?: boolean;
}

/**
 * DTO para atualização de um usuário existente
 */
export interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  emailVerified?: boolean;
}
