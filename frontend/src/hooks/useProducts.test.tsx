import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts, useProduct, useCreateProduct, useUpdateProduct, useDeleteProduct } from "./useProducts";
import * as productsApi from "@/lib/api/products";

// Mock da API
vi.mock("@/lib/api/products");
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

describe("useProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar produtos com sucesso", async () => {
    const mockProducts = {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };

    vi.mocked(productsApi.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProducts);
  });

  it("deve buscar produtos com parâmetros", async () => {
    const mockProducts = {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };

    vi.mocked(productsApi.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(
      () => useProducts({ pageNumber: 2, pageSize: 20 }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(productsApi.getProducts).toHaveBeenCalledWith({
      pageNumber: 2,
      pageSize: 20,
    });
  });
});

describe("useProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar um produto por ID", async () => {
    const mockProduct = {
      id: "1",
      name: "Produto Teste",
      price: 100,
      currency: "BRL",
      categoryId: "cat1",
      stockQuantity: 50,
      isLowStock: false,
      isOutOfStock: false,
      status: 1,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    vi.mocked(productsApi.getProductById).mockResolvedValue(mockProduct);

    const { result } = renderHook(() => useProduct("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProduct);
    expect(productsApi.getProductById).toHaveBeenCalledWith("1");
  });

  it("não deve buscar quando ID é vazio", () => {
    const { result } = renderHook(() => useProduct(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(productsApi.getProductById).not.toHaveBeenCalled();
  });
});

describe("useCreateProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar produto com sucesso", async () => {
    const newProduct = {
      name: "Novo Produto",
      price: 100,
      currency: "BRL",
      categoryId: "cat1",
      stockQuantity: 10,
    };

    const createdProduct = {
      id: "1",
      ...newProduct,
      isLowStock: false,
      isOutOfStock: false,
      status: 1,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    vi.mocked(productsApi.createProduct).mockResolvedValue(createdProduct);

    const { result } = renderHook(() => useCreateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newProduct);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(productsApi.createProduct).toHaveBeenCalledWith(newProduct);
  });

  it("deve tratar erro ao criar produto", async () => {
    const error = new Error("Erro ao criar produto");
    vi.mocked(productsApi.createProduct).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      name: "Produto",
      price: 100,
      currency: "BRL",
      categoryId: "cat1",
      stockQuantity: 10,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useUpdateProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve atualizar produto com sucesso", async () => {
    const updateData = {
      name: "Produto Atualizado",
      price: 150,
    };

    const updatedProduct = {
      id: "1",
      name: "Produto Atualizado",
      price: 150,
      currency: "BRL",
      categoryId: "cat1",
      stockQuantity: 50,
      isLowStock: false,
      isOutOfStock: false,
      status: 1,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
    };

    vi.mocked(productsApi.updateProduct).mockResolvedValue(updatedProduct);

    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "1", data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(productsApi.updateProduct).toHaveBeenCalledWith("1", updateData);
  });
});

describe("useDeleteProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve excluir produto com sucesso", async () => {
    vi.mocked(productsApi.deleteProduct).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(productsApi.deleteProduct).toHaveBeenCalledWith("1");
  });
});
