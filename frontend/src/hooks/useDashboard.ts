import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getDashboardLowStockProducts,
  getProductsByCategory,
} from "@/lib/api/dashboard";

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  lowStock: () => [...dashboardKeys.all, "low-stock"] as const,
  productsByCategory: () => [...dashboardKeys.all, "products-by-category"] as const,
};

/**
 * Hook para obter estatísticas do dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obter produtos com estoque baixo no dashboard
 */
export function useDashboardLowStock() {
  return useQuery({
    queryKey: dashboardKeys.lowStock(),
    queryFn: getDashboardLowStockProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obter contagem de produtos por categoria
 */
export function useProductsByCategory() {
  return useQuery({
    queryKey: dashboardKeys.productsByCategory(),
    queryFn: getProductsByCategory,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}
