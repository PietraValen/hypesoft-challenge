import { api } from "./client";
import type { ApiResponse, PagedResult } from "@/types/api";
import type { Product } from "@/types/product";

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  categoryId: string;
  stockQuantity: number;
}

export interface UpdateProductDto {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  categoryId: string;
  status?: number;
}

export interface UpdateStockDto {
  quantity: number;
}

export interface GetProductsParams {
  pageNumber?: number;
  pageSize?: number;
  categoryId?: string;
  status?: number;
}

/**
 * Obtém lista paginada de produtos
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<PagedResult<Product>> {
  const response = await api.get<ApiResponse<PagedResult<Product>>>(
    "/api/products",
    { params }
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch products");
  }
  return response.data.data;
}

/**
 * Obtém produto por ID
 */
export async function getProductById(id: string): Promise<Product> {
  const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Product not found");
  }
  return response.data.data;
}

/**
 * Busca produtos por nome
 */
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const response = await api.get<ApiResponse<Product[]>>("/api/products/search", {
    params: { q: searchTerm },
  });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Search failed");
  }
  return response.data.data;
}

/**
 * Obtém produtos com estoque baixo
 */
export async function getLowStockProducts(): Promise<Product[]> {
  const response = await api.get<ApiResponse<Product[]>>(
    "/api/products/low-stock"
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch low stock products");
  }
  return response.data.data;
}

/**
 * Cria um novo produto
 */
export async function createProduct(
  data: CreateProductDto
): Promise<Product> {
  const response = await api.post<ApiResponse<Product>>("/api/products", data);
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message ||
        response.data.errors?.join(", ") ||
        "Failed to create product"
    );
  }
  return response.data.data;
}

/**
 * Atualiza um produto existente
 */
export async function updateProduct(
  id: string,
  data: UpdateProductDto
): Promise<Product> {
  const response = await api.put<ApiResponse<Product>>(
    `/api/products/${id}`,
    data
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message ||
        response.data.errors?.join(", ") ||
        "Failed to update product"
    );
  }
  return response.data.data;
}

/**
 * Atualiza o estoque de um produto
 */
export async function updateStock(
  id: string,
  data: UpdateStockDto
): Promise<Product> {
  const response = await api.put<ApiResponse<Product>>(
    `/api/products/${id}/stock`,
    data
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message ||
        response.data.errors?.join(", ") ||
        "Failed to update stock"
    );
  }
  return response.data.data;
}

/**
 * Exclui um produto
 */
export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/api/products/${id}`);
}
