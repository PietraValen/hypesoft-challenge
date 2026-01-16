import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatDateTime } from "./format";

describe("formatCurrency", () => {
  it("deve formatar valores em BRL corretamente", () => {
    expect(formatCurrency(1000)).toBe("R$ 1.000,00");
    expect(formatCurrency(99.99)).toBe("R$ 99,99");
    expect(formatCurrency(0)).toBe("R$ 0,00");
  });

  it("deve formatar valores em USD corretamente", () => {
    expect(formatCurrency(1000, "USD")).toBe("US$ 1.000,00");
    expect(formatCurrency(50.5, "USD")).toBe("US$ 50,50");
  });

  it("deve formatar valores em EUR corretamente", () => {
    expect(formatCurrency(1000, "EUR")).toBe("€ 1.000,00");
  });

  it("deve lidar com valores decimais", () => {
    expect(formatCurrency(1234.56)).toBe("R$ 1.234,56");
    expect(formatCurrency(0.01)).toBe("R$ 0,01");
  });
});

describe("formatDate", () => {
  it("deve formatar datas string corretamente", () => {
    const date = "2024-01-15T10:30:00Z";
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("deve formatar objetos Date corretamente", () => {
    const date = new Date("2024-01-15T10:30:00Z");
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("deve retornar formato DD/MM/YYYY", () => {
    const date = new Date("2024-12-25");
    const formatted = formatDate(date);
    expect(formatted).toBe("25/12/2024");
  });
});

describe("formatDateTime", () => {
  it("deve formatar data e hora corretamente", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const formatted = formatDateTime(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
  });

  it("deve formatar string de data e hora", () => {
    const date = "2024-01-15T14:30:00Z";
    const formatted = formatDateTime(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
  });
});
