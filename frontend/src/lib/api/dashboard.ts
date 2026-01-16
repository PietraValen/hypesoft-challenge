import { api } from "./client";
import type { ApiResponse } from "@/types/api";
import type { DashboardStats, CategoryProductCount } from "@/types/dashboard";
import type { Product } from "@/types/product";

/**
 * Obtém estatísticas do dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<ApiResponse<DashboardStats>>(
    "/api/dashboard/stats"
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch dashboard stats");
  }
  return response.data.data;
}

/**
 * Obtém produtos com estoque baixo para o dashboard
 */
export async function getDashboardLowStockProducts(): Promise<Product[]> {
  const response = await api.get<ApiResponse<Product[]>>(
    "/api/dashboard/low-stock"
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Failed to fetch low stock products"
    );
  }
  return response.data.data;
}

/**
 * Obtém contagem de produtos por categoria
 */
export async function getProductsByCategory(): Promise<CategoryProductCount[]> {
  const response = await api.get<ApiResponse<CategoryProductCount[]>>(
    "/api/dashboard/products-by-category"
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Failed to fetch products by category"
    );
  }
  return response.data.data;
}
