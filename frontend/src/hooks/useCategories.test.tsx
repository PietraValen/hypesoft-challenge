import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./useCategories";
import * as categoriesApi from "@/lib/api/categories";

// Mock da API
vi.mock("@/lib/api/categories");
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

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar categorias com sucesso", async () => {
    const mockCategories = [
      {
        id: "1",
        name: "Categoria 1",
        description: "Descrição 1",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "2",
        name: "Categoria 2",
        description: "Descrição 2",
        createdAt: "2024-01-02",
        updatedAt: "2024-01-02",
      },
    ];

    vi.mocked(categoriesApi.getCategories).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCategories);
  });
});

describe("useCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar uma categoria por ID", async () => {
    const mockCategory = {
      id: "1",
      name: "Categoria Teste",
      description: "Descrição",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    vi.mocked(categoriesApi.getCategoryById).mockResolvedValue(mockCategory);

    const { result } = renderHook(() => useCategory("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCategory);
    expect(categoriesApi.getCategoryById).toHaveBeenCalledWith("1");
  });

  it("não deve buscar quando ID é vazio", () => {
    const { result } = renderHook(() => useCategory(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(categoriesApi.getCategoryById).not.toHaveBeenCalled();
  });
});

describe("useCreateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar categoria com sucesso", async () => {
    const newCategory = {
      name: "Nova Categoria",
      description: "Descrição",
    };

    const createdCategory = {
      id: "1",
      ...newCategory,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    vi.mocked(categoriesApi.createCategory).mockResolvedValue(createdCategory);

    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newCategory);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(categoriesApi.createCategory).toHaveBeenCalledWith(newCategory);
  });

  it("deve tratar erro ao criar categoria", async () => {
    const error = new Error("Erro ao criar categoria");
    vi.mocked(categoriesApi.createCategory).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      name: "Categoria",
      description: "Descrição",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useUpdateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve atualizar categoria com sucesso", async () => {
    const updateData = {
      name: "Categoria Atualizada",
      description: "Nova descrição",
    };

    const updatedCategory = {
      id: "1",
      ...updateData,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
    };

    vi.mocked(categoriesApi.updateCategory).mockResolvedValue(updatedCategory);

    const { result } = renderHook(() => useUpdateCategory(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "1", data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(categoriesApi.updateCategory).toHaveBeenCalledWith("1", updateData);
  });
});

describe("useDeleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve excluir categoria com sucesso", async () => {
    vi.mocked(categoriesApi.deleteCategory).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(categoriesApi.deleteCategory).toHaveBeenCalledWith("1");
  });
});
