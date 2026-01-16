import { z } from "zod";

/**
 * Schema de validação para criar produto
 */
export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  price: z
    .number({
      required_error: "Preço é obrigatório",
      invalid_type_error: "Preço deve ser um número",
    })
    .positive("Preço deve ser positivo")
    .max(999999.99, "Preço muito alto"),
  currency: z.string().default("BRL"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  stockQuantity: z
    .number({
      required_error: "Quantidade em estoque é obrigatória",
      invalid_type_error: "Quantidade deve ser um número",
    })
    .int("Quantidade deve ser um número inteiro")
    .min(0, "Quantidade não pode ser negativa"),
});

/**
 * Schema de validação para atualizar produto
 */
export const updateProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  price: z
    .number({
      required_error: "Preço é obrigatório",
      invalid_type_error: "Preço deve ser um número",
    })
    .positive("Preço deve ser positivo")
    .max(999999.99, "Preço muito alto"),
  currency: z.string().default("BRL"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  status: z.number().int().min(1).max(3).optional(),
});

/**
 * Schema de validação para atualizar estoque
 */
export const updateStockSchema = z.object({
  quantity: z
    .number({
      required_error: "Quantidade é obrigatória",
      invalid_type_error: "Quantidade deve ser um número",
    })
    .int("Quantidade deve ser um número inteiro")
    .min(0, "Quantidade não pode ser negativa"),
});

/**
 * Schema de validação para criar categoria
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
});

/**
 * Schema de validação para atualizar categoria
 */
export const updateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
});

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Usuário ou email é obrigatório")
    .max(255, "Usuário ou email muito longo"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

/**
 * Schema de validação para solicitação de cadastro
 */
export const registerRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email muito longo"),
  firstName: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome muito longo"),
  lastName: z
    .string()
    .min(1, "Sobrenome é obrigatório")
    .max(100, "Sobrenome muito longo"),
  username: z
    .string()
    .min(3, "Usuário deve ter no mínimo 3 caracteres")
    .max(50, "Usuário muito longo")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Usuário deve conter apenas letras, números e underscore"
    ),
  message: z
    .string()
    .max(500, "Mensagem muito longa")
    .optional(),
});

/**
 * Schema de validação para criar usuário
 */
export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Usuário deve ter no mínimo 3 caracteres")
    .max(50, "Usuário muito longo")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Usuário deve conter apenas letras, números e underscore"
    ),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email muito longo"),
  firstName: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome muito longo"),
  lastName: z
    .string()
    .min(1, "Sobrenome é obrigatório")
    .max(100, "Sobrenome muito longo"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  enabled: z.boolean().optional().default(true),
  emailVerified: z.boolean().optional().default(false),
});

/**
 * Schema de validação para atualizar usuário
 */
export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Usuário deve ter no mínimo 3 caracteres")
    .max(50, "Usuário muito longo")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Usuário deve conter apenas letras, números e underscore"
    )
    .optional(),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .optional(),
  firstName: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome muito longo")
    .optional(),
  lastName: z
    .string()
    .min(1, "Sobrenome é obrigatório")
    .max(100, "Sobrenome muito longo")
    .optional(),
  enabled: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

/**
 * Tipos TypeScript derivados dos schemas
 */
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type UpdateStockDto = z.infer<typeof updateStockSchema>;
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
