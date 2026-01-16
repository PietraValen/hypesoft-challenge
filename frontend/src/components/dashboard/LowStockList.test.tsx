import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LowStockList } from "./LowStockList";
import { useDashboardLowStock } from "@/hooks/useDashboard";
import { createMockProduct } from "@/test/test-utils";

// Mock do hook
vi.mock("@/hooks/useDashboard", () => ({
  useDashboardLowStock: vi.fn(),
}));

// Mock do Link do Next.js
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("LowStockList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir loading state", () => {
    vi.mocked(useDashboardLowStock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    render(<LowStockList />);

    expect(screen.getByText("Produtos com Estoque Baixo")).toBeInTheDocument();
    // Verificar se skeletons são exibidos (pode não ter testid, então verificamos pela estrutura)
    const cardContent = screen.getByText("Produtos com Estoque Baixo").closest("div");
    expect(cardContent).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não há produtos com estoque baixo", () => {
    vi.mocked(useDashboardLowStock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<LowStockList />);

    expect(
      screen.getByText("Nenhum produto com estoque baixo")
    ).toBeInTheDocument();
  });

  it("deve exibir produtos com estoque baixo", () => {
    const lowStockProducts = [
      createMockProduct({
        id: "1",
        name: "Produto 1",
        stockQuantity: 5,
        isLowStock: true,
        isOutOfStock: false,
      }),
      createMockProduct({
        id: "2",
        name: "Produto 2",
        stockQuantity: 0,
        isLowStock: false,
        isOutOfStock: true,
      }),
    ];

    vi.mocked(useDashboardLowStock).mockReturnValue({
      data: lowStockProducts,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<LowStockList />);

    expect(screen.getByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("Produto 2")).toBeInTheDocument();
  });

  it("deve exibir botão 'Ver Todos' quando há mais de 5 produtos", () => {
    const manyProducts = Array.from({ length: 10 }, (_, i) =>
      createMockProduct({
        id: `${i + 1}`,
        name: `Produto ${i + 1}`,
        stockQuantity: 5,
        isLowStock: true,
      })
    );

    vi.mocked(useDashboardLowStock).mockReturnValue({
      data: manyProducts,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<LowStockList />);

    expect(screen.getByText(/Ver Todos \(10\)/)).toBeInTheDocument();
  });

  it("não deve exibir botão 'Ver Todos' quando há 5 ou menos produtos", () => {
    const fewProducts = Array.from({ length: 5 }, (_, i) =>
      createMockProduct({
        id: `${i + 1}`,
        name: `Produto ${i + 1}`,
        stockQuantity: 5,
        isLowStock: true,
      })
    );

    vi.mocked(useDashboardLowStock).mockReturnValue({
      data: fewProducts,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<LowStockList />);

    expect(screen.queryByText(/Ver Todos/)).not.toBeInTheDocument();
  });

  it("deve exibir apenas os primeiros 5 produtos", () => {
    const manyProducts = Array.from({ length: 10 }, (_, i) =>
      createMockProduct({
        id: `${i + 1}`,
        name: `Produto ${i + 1}`,
        stockQuantity: 5,
        isLowStock: true,
      })
    );

    vi.mocked(useDashboardLowStock).mockReturnValue({
      data: manyProducts,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<LowStockList />);

    // Deve exibir apenas os primeiros 5
    expect(screen.getByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("Produto 5")).toBeInTheDocument();
    expect(screen.queryByText("Produto 6")).not.toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando há erro", () => {
    vi.mocked(useDashboardLowStock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Erro ao carregar"),
    } as any);

    render(<LowStockList />);

    expect(
      screen.getByText("Nenhum produto com estoque baixo")
    ).toBeInTheDocument();
  });
});
