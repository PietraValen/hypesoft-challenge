import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StockUpdateDialog } from "./StockUpdateDialog";
import { Product, ProductStatus } from "@/types/product";

describe("StockUpdateDialog", () => {
  const mockOnSubmit = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("não deve renderizar quando produto é null", () => {
    const { container } = render(
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("deve renderizar o diálogo quando produto é fornecido", () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
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
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Atualizar Estoque")).toBeInTheDocument();
    expect(screen.getByText(/Produto Teste/)).toBeInTheDocument();
    expect(screen.getByLabelText("Quantidade em Estoque")).toBeInTheDocument();
  });

  it("deve exibir o estoque atual do produto", () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
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
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Estoque atual: 50 unidades")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
  });

  it("deve atualizar o valor quando o usuário digita", async () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
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
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    const quantityInput = screen.getByLabelText("Quantidade em Estoque");
    fireEvent.change(quantityInput, { target: { value: "75" } });

    await waitFor(() => {
      expect(quantityInput).toHaveValue(75);
    });
  });

  it("deve chamar onSubmit com dados válidos", async () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
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
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    const quantityInput = screen.getByLabelText("Quantidade em Estoque");
    fireEvent.change(quantityInput, { target: { value: "100" } });

    const submitButton = screen.getByRole("button", { name: /atualizar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 100,
        })
      );
    });
  });

  it("deve chamar onOpenChange quando clicar em cancelar", () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
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
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("deve desabilitar botões quando isLoading é true", () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
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
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole("button", { name: /atualizando/i });
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it("deve resetar o formulário quando o produto muda", () => {
    const product1: Product = {
      id: "1",
      name: "Produto 1",
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

    const product2: Product = {
      id: "2",
      name: "Produto 2",
      price: 200,
      currency: "BRL",
      categoryId: "cat2",
      stockQuantity: 25,
      isLowStock: false,
      isOutOfStock: false,
      status: ProductStatus.Active,
      createdAt: "2024-01-02",
      updatedAt: "2024-01-02",
    };

    const { rerender } = render(
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product1}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByDisplayValue("50")).toBeInTheDocument();

    rerender(
      <StockUpdateDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        product={product2}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
  });
});
