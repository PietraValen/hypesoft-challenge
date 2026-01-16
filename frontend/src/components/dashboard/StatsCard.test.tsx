import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "./StatsCard";
import { Package } from "lucide-react";

describe("StatsCard", () => {
  it("deve renderizar título e valor corretamente", () => {
    render(
      <StatsCard
        title="Total de Produtos"
        value={100}
        icon={Package}
      />
    );

    expect(screen.getByText("Total de Produtos")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("deve renderizar valor como string", () => {
    render(
      <StatsCard
        title="Valor Total"
        value="R$ 10.000,00"
        icon={Package}
      />
    );

    expect(screen.getByText("R$ 10.000,00")).toBeInTheDocument();
  });

  it("deve renderizar mudança positiva", () => {
    render(
      <StatsCard
        title="Vendas"
        value={50}
        change={{ value: "10%", isPositive: true }}
        icon={Package}
      />
    );

    const changeText = screen.getByText("+10%");
    expect(changeText).toBeInTheDocument();
    expect(changeText).toHaveClass("text-green-600");
  });

  it("deve renderizar mudança negativa", () => {
    render(
      <StatsCard
        title="Vendas"
        value={50}
        change={{ value: "5%", isPositive: false }}
        icon={Package}
      />
    );

    const changeText = screen.getByText("5%");
    expect(changeText).toBeInTheDocument();
    expect(changeText).toHaveClass("text-red-600");
  });

  it("não deve renderizar mudança quando não fornecida", () => {
    render(
      <StatsCard
        title="Produtos"
        value={100}
        icon={Package}
      />
    );

    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it("deve renderizar o ícone", () => {
    render(
      <StatsCard
        title="Produtos"
        value={100}
        icon={Package}
      />
    );

    const icon = screen.getByRole("img", { hidden: true }) || 
                 document.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
