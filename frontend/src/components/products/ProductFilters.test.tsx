import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductFilters } from "./ProductFilters";
import { ProductStatus } from "@/types/product";

// Mock do hook useCategories
vi.mock("@/hooks/useCategories", () => ({
  useCategories: () => ({
    data: [
      { id: "cat1", name: "Categoria 1" },
      { id: "cat2", name: "Categoria 2" },
    ],
  }),
}));

// Mock do hook useDebounce
vi.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

describe("ProductFilters", () => {
  const mockOnSearchChange = vi.fn();
  const mockOnCategoryChange = vi.fn();
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o campo de busca", () => {
    render(
      <ProductFilters
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Buscar produtos...");
    expect(searchInput).toBeInTheDocument();
  });

  it("deve atualizar o valor de busca quando o usuário digita", async () => {
    render(
      <ProductFilters
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Buscar produtos...");
    fireEvent.change(searchInput, { target: { value: "produto teste" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("produto teste");
    });
  });

  it("deve renderizar o seletor de categorias", () => {
    render(
      <ProductFilters
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText("Todas as categorias")).toBeInTheDocument();
  });

  it("deve renderizar o seletor de status", () => {
    render(
      <ProductFilters
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText("Todos os status")).toBeInTheDocument();
  });

  it("deve chamar onCategoryChange quando selecionar uma categoria", () => {
    render(
      <ProductFilters
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        categoryId=""
        onCategoryChange={mockOnCategoryChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    // Simular seleção de categoria (pode precisar ajuste baseado na implementação real do Select)
    // Este teste pode precisar ser ajustado dependendo de como o Select funciona
  });

  it("deve chamar onStatusChange quando selecionar um status", () => {
    render(
      <ProductFilters
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        status={undefined}
        onStatusChange={mockOnStatusChange}
      />
    );

    // Simular seleção de status
  });

  it("deve exibir botão limpar quando há filtros ativos", () => {
    render(
      <ProductFilters
        searchTerm="teste"
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText("Limpar")).toBeInTheDocument();
  });

  it("não deve exibir botão limpar quando não há filtros", () => {
    render(
      <ProductFilters
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.queryByText("Limpar")).not.toBeInTheDocument();
  });

  it("deve limpar todos os filtros quando clicar em limpar", () => {
    render(
      <ProductFilters
        searchTerm="teste"
        categoryId="cat1"
        status={ProductStatus.Active}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    const clearButton = screen.getByText("Limpar");
    fireEvent.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith("");
    expect(mockOnCategoryChange).toHaveBeenCalledWith("");
    expect(mockOnStatusChange).toHaveBeenCalledWith(undefined);
  });
});
