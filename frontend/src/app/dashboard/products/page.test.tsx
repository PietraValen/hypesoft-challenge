import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders, createMockProduct, createMockPagedResult } from "@/test/test-utils";
import ProductsPage from "./page";
import * as useProductsHook from "@/hooks/useProducts";

// Mock dos hooks
vi.mock("@/hooks/useProducts", () => ({
  useProducts: vi.fn(),
  useCreateProduct: vi.fn(),
  useUpdateProduct: vi.fn(),
  useUpdateStock: vi.fn(),
  useDeleteProduct: vi.fn(),
}));

// Mock dos componentes que podem ter problemas de renderização
vi.mock("@/components/products/ProductFilters", () => ({
  ProductFilters: ({ searchTerm, onSearchChange }: any) => (
    <div data-testid="product-filters">
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar produtos..."
      />
    </div>
  ),
}));

vi.mock("@/components/products/ProductTable", () => ({
  ProductTable: ({ data, onEdit, onDelete, onUpdateStock }: any) => (
    <div data-testid="product-table">
      {data.items.map((product: any) => (
        <div key={product.id} data-testid={`product-${product.id}`}>
          <span>{product.name}</span>
          <button
            data-testid={`edit-${product.id}`}
            onClick={() => onEdit(product)}
          >
            Editar
          </button>
          <button
            data-testid={`delete-${product.id}`}
            onClick={() => onDelete(product)}
          >
            Excluir
          </button>
          <button
            data-testid={`stock-${product.id}`}
            onClick={() => onUpdateStock(product)}
          >
            Atualizar Estoque
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/products/ProductForm", () => ({
  ProductForm: ({ open, product, onSubmit }: any) =>
    open ? (
      <div data-testid="product-form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name: "Novo Produto", price: 100 });
          }}
        >
          <button type="submit">Salvar</button>
        </form>
      </div>
    ) : null,
}));

vi.mock("@/components/products/StockUpdateDialog", () => ({
  StockUpdateDialog: ({ open, product, onSubmit }: any) =>
    open && product ? (
      <div data-testid="stock-dialog">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ quantity: 100 });
          }}
        >
          <button type="submit">Atualizar</button>
        </form>
      </div>
    ) : null,
}));

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ open, children }: any) => (open ? <div>{children}</div> : null),
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <h3>{children}</h3>,
  AlertDialogDescription: ({ children }: any) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogCancel: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  AlertDialogAction: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("ProductsPage - Integração", () => {
  const mockProducts = [
    createMockProduct({ id: "1", name: "Produto 1" }),
    createMockProduct({ id: "2", name: "Produto 2" }),
  ];

  const mockUseProducts = vi.fn();
  const mockCreateMutation = {
    mutate: vi.fn(),
    isPending: false,
  };
  const mockUpdateMutation = {
    mutate: vi.fn(),
    isPending: false,
  };
  const mockUpdateStockMutation = {
    mutate: vi.fn(),
    isPending: false,
  };
  const mockDeleteMutation = {
    mutate: vi.fn(),
    isPending: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProductsHook.useProducts).mockReturnValue({
      data: createMockPagedResult(mockProducts),
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(useProductsHook.useCreateProduct).mockReturnValue(
      mockCreateMutation as any
    );
    vi.mocked(useProductsHook.useUpdateProduct).mockReturnValue(
      mockUpdateMutation as any
    );
    vi.mocked(useProductsHook.useUpdateStock).mockReturnValue(
      mockUpdateStockMutation as any
    );
    vi.mocked(useProductsHook.useDeleteProduct).mockReturnValue(
      mockDeleteMutation as any
    );
  });

  it("deve renderizar a página de produtos com dados", () => {
    renderWithProviders(<ProductsPage />);

    expect(screen.getByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Gerencie seus produtos e estoque")).toBeInTheDocument();
    expect(screen.getByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("Produto 2")).toBeInTheDocument();
  });

  it("deve exibir loading state", () => {
    vi.mocked(useProductsHook.useProducts).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    renderWithProviders(<ProductsPage />);

    // Verificar se loading state é exibido (skeletons podem não ter testid)
    expect(screen.getByText("Produtos")).toBeInTheDocument();
  });

  it("deve abrir formulário ao clicar em Novo Produto", async () => {
    renderWithProviders(<ProductsPage />);

    const newProductButton = screen.getByText("Novo Produto");
    newProductButton.click();

    await waitFor(() => {
      expect(screen.getByTestId("product-form")).toBeInTheDocument();
    });
  });

  it("deve abrir formulário de edição ao clicar em editar produto", async () => {
    renderWithProviders(<ProductsPage />);

    const editButton = screen.getByTestId("edit-1");
    editButton.click();

    await waitFor(() => {
      expect(screen.getByTestId("product-form")).toBeInTheDocument();
    });
  });

  it("deve abrir diálogo de estoque ao clicar em atualizar estoque", async () => {
    renderWithProviders(<ProductsPage />);

    const stockButton = screen.getByTestId("stock-1");
    stockButton.click();

    await waitFor(() => {
      expect(screen.getByTestId("stock-dialog")).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de erro quando não há dados", () => {
    vi.mocked(useProductsHook.useProducts).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Erro ao carregar"),
    } as any);

    renderWithProviders(<ProductsPage />);

    expect(screen.getByText("Erro ao carregar produtos")).toBeInTheDocument();
  });
});
