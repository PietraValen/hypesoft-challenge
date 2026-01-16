import { api } from "./client";
import type { ApiResponse } from "@/types/api";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name: string;
  description?: string;
}

/**
 * Obtém todas as categorias
 */
export async function getCategories(): Promise<Category[]> {
  const response = await api.get<ApiResponse<Category[]>>("/api/categories");
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch categories");
  }
  return response.data.data;
}

/**
 * Obtém categoria por ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  const response = await api.get<ApiResponse<Category>>(
    `/api/categories/${id}`
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Category not found");
  }
  return response.data.data;
}

/**
 * Obtém produtos de uma categoria
 */
export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const response = await api.get<ApiResponse<Product[]>>(
    `/api/categories/${categoryId}/products`
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Failed to fetch category products"
    );
  }
  return response.data.data;
}

/**
 * Cria uma nova categoria
 */
export async function createCategory(
  data: CreateCategoryDto
): Promise<Category> {
  const response = await api.post<ApiResponse<Category>>("/api/categories", data);
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message ||
        response.data.errors?.join(", ") ||
        "Failed to create category"
    );
  }
  return response.data.data;
}

/**
 * Atualiza uma categoria existente
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryDto
): Promise<Category> {
  const response = await api.put<ApiResponse<Category>>(
    `/api/categories/${id}`,
    data
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message ||
        response.data.errors?.join(", ") ||
        "Failed to update category"
    );
  }
  return response.data.data;
}

/**
 * Exclui uma categoria
 */
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/api/categories/${id}`);
}
