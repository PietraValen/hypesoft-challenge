import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Cria um QueryClient para testes com configurações otimizadas
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // gcTime substitui cacheTime no React Query v5
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper para testes que inclui QueryClientProvider
 */
export function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * Função helper para renderizar componentes com providers necessários
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    wrapper: TestWrapper,
    ...options,
  });
}

/**
 * Helper para criar dados mock de produtos
 */
export function createMockProduct(overrides?: Partial<any>): any {
  return {
    id: "1",
    name: "Produto Teste",
    description: "Descrição do produto",
    price: 100,
    currency: "BRL",
    categoryId: "cat1",
    categoryName: "Categoria 1",
    stockQuantity: 50,
    isLowStock: false,
    isOutOfStock: false,
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

/**
 * Helper para criar dados mock de categorias
 */
export function createMockCategory(overrides?: Partial<any>): any {
  return {
    id: "1",
    name: "Categoria Teste",
    description: "Descrição da categoria",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

/**
 * Helper para criar PagedResult mock
 */
export function createMockPagedResult<T>(items: T[], overrides?: Partial<any>): any {
  return {
    items,
    pageNumber: 1,
    pageSize: 10,
    totalCount: items.length,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    ...overrides,
  };
}
