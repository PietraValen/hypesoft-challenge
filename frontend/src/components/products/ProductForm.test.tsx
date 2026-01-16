import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductForm } from "./ProductForm";
import { Product, ProductStatus } from "@/types/product";

// Mock do CategorySelect
vi.mock("@/components/categories/CategorySelect", () => ({
  CategorySelect: ({ value, onValueChange, placeholder }: any) => (
    <select
      data-testid="category-select"
      value={value || ""}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      <option value="cat1">Categoria 1</option>
      <option value="cat2">Categoria 2</option>
    </select>
  ),
}));

describe("ProductForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o formulário de criação", () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Criar Produto")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toBeInTheDocument();
    expect(screen.getByLabelText("Preço *")).toBeInTheDocument();
  });

  it("deve renderizar o formulário de edição quando produto é fornecido", () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
      description: "Descrição",
      price: 100,
      currency: "BRL",
      categoryId: "cat1",
      stockQuantity: 50,
      isLowStock: false,
      isOutOfStock: false,
      status: ProductStatus.Active,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Editar Produto")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it("deve validar campos obrigatórios", async () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole("button", { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("deve chamar onSubmit com dados válidos ao criar produto", async () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Novo Produto" },
    });
    fireEvent.change(screen.getByLabelText("Preço *"), {
      target: { value: "99.99" },
    });
    fireEvent.change(screen.getByTestId("category-select"), {
      target: { value: "cat1" },
    });
    fireEvent.change(screen.getByLabelText("Quantidade em Estoque *"), {
      target: { value: "10" },
    });

    const submitButton = screen.getByRole("button", { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Novo Produto",
          price: 99.99,
          categoryId: "cat1",
          stockQuantity: 10,
        })
      );
    });
  });

  it("deve chamar onSubmit com dados válidos ao editar produto", async () => {
    const product: Product = {
      id: "1",
      name: "Produto Original",
      price: 100,
      currency: "BRL",
      categoryId: "cat1",
      stockQuantity: 50,
      isLowStock: false,
      isOutOfStock: false,
      status: ProductStatus.Active,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Produto Atualizado" },
    });

    const submitButton = screen.getByRole("button", { name: /atualizar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("deve exibir campo de estoque apenas ao criar", () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText("Quantidade em Estoque *")).toBeInTheDocument();
  });

  it("não deve exibir campo de estoque ao editar", () => {
    const product: Product = {
      id: "1",
      name: "Produto",
      price: 100,
      currency: "BRL",
      categoryId: "cat1",
      stockQuantity: 50,
      isLowStock: false,
      isOutOfStock: false,
      status: ProductStatus.Active,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByLabelText("Quantidade em Estoque *")).not.toBeInTheDocument();
  });

  it("deve exibir seletor de status apenas ao editar", () => {
    const product: Product = {
      id: "1",
      name: "Produto",
      price: 100,
      currency: "BRL",
      categoryId: "cat1",
      stockQuantity: 50,
      isLowStock: false,
      isOutOfStock: false,
      status: ProductStatus.Active,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  it("deve chamar onOpenChange quando clicar em cancelar", () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("deve desabilitar botões quando isLoading é true", () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole("button", { name: /salvando/i });
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });
});
