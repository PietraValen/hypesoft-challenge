import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductTable } from "./ProductTable";
import { Product, ProductStatus } from "@/types/product";
import { PagedResult } from "@/types/api";

// Mock dos componentes de UI que podem ter problemas de renderização
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Produto 1",
    description: "Descrição 1",
    price: 100,
    currency: "BRL",
    categoryId: "cat1",
    categoryName: "Categoria 1",
    stockQuantity: 50,
    isLowStock: false,
    isOutOfStock: false,
    status: ProductStatus.Active,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Produto 2",
    price: 200,
    currency: "BRL",
    categoryId: "cat2",
    categoryName: "Categoria 2",
    stockQuantity: 5,
    isLowStock: true,
    isOutOfStock: false,
    status: ProductStatus.Active,
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Produto 3",
    price: 300,
    currency: "BRL",
    categoryId: "cat3",
    stockQuantity: 0,
    isLowStock: false,
    isOutOfStock: true,
    status: ProductStatus.Inactive,
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
];

const mockPagedResult: PagedResult<Product> = {
  items: mockProducts,
  pageNumber: 1,
  pageSize: 10,
  totalCount: 3,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

describe("ProductTable", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnUpdateStock = vi.fn();
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar a tabela com produtos", () => {
    render(
      <ProductTable
        data={mockPagedResult}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("Produto 2")).toBeInTheDocument();
    expect(screen.getByText("Produto 3")).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não há produtos", () => {
    const emptyData: PagedResult<Product> = {
      ...mockPagedResult,
      items: [],
    };

    render(
      <ProductTable
        data={emptyData}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("Nenhum produto encontrado")).toBeInTheDocument();
  });

  it("deve exibir categorias corretamente", () => {
    render(
      <ProductTable
        data={mockPagedResult}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("Categoria 1")).toBeInTheDocument();
    expect(screen.getByText("Categoria 2")).toBeInTheDocument();
  });

  it("deve exibir N/A quando categoria não tem nome", () => {
    render(
      <ProductTable
        data={mockPagedResult}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("deve chamar onEdit quando clicar em editar", () => {
    render(
      <ProductTable
        data={mockPagedResult}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    const editButtons = screen.getAllByText("Editar");
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("deve chamar onDelete quando clicar em excluir", () => {
    render(
      <ProductTable
        data={mockPagedResult}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    const deleteButtons = screen.getAllByText("Excluir");
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("deve chamar onUpdateStock quando clicar em atualizar estoque", () => {
    render(
      <ProductTable
        data={mockPagedResult}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    const stockButtons = screen.getAllByText("Atualizar Estoque");
    fireEvent.click(stockButtons[0]);

    expect(mockOnUpdateStock).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("deve renderizar paginação quando há múltiplas páginas", () => {
    const pagedData: PagedResult<Product> = {
      ...mockPagedResult,
      totalPages: 3,
      hasNextPage: true,
    };

    render(
      <ProductTable
        data={pagedData}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("Página 1 de 3")).toBeInTheDocument();
    expect(screen.getByText("Próxima")).toBeInTheDocument();
  });

  it("deve chamar onPageChange quando clicar em próxima página", () => {
    const pagedData: PagedResult<Product> = {
      ...mockPagedResult,
      totalPages: 2,
      hasNextPage: true,
    };

    render(
      <ProductTable
        data={pagedData}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText("Próxima");
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("deve desabilitar botão anterior na primeira página", () => {
    const pagedData: PagedResult<Product> = {
      ...mockPagedResult,
      totalPages: 2,
      hasPreviousPage: false,
      hasNextPage: true,
    };

    render(
      <ProductTable
        data={pagedData}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdateStock={mockOnUpdateStock}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByText("Anterior");
    expect(prevButton).toBeDisabled();
  });
});
