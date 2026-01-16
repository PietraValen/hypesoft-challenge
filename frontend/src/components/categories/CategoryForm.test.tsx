import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CategoryForm } from "./CategoryForm";
import { Category } from "@/types/category";

describe("CategoryForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o formulário de criação", () => {
    render(
      <CategoryForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Criar Categoria")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
  });

  it("deve renderizar o formulário de edição quando categoria é fornecida", () => {
    const category: Category = {
      id: "1",
      name: "Categoria Teste",
      description: "Descrição da categoria",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(
      <CategoryForm
        open={true}
        onOpenChange={mockOnOpenChange}
        category={category}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Editar Categoria")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Categoria Teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Descrição da categoria")).toBeInTheDocument();
  });

  it("deve validar campo nome obrigatório", async () => {
    render(
      <CategoryForm
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

  it("deve chamar onSubmit com dados válidos ao criar categoria", async () => {
    render(
      <CategoryForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Nova Categoria" },
    });
    fireEvent.change(screen.getByLabelText("Descrição"), {
      target: { value: "Descrição da nova categoria" },
    });

    const submitButton = screen.getByRole("button", { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Nova Categoria",
          description: "Descrição da nova categoria",
        })
      );
    });
  });

  it("deve chamar onSubmit com dados válidos ao editar categoria", async () => {
    const category: Category = {
      id: "1",
      name: "Categoria Original",
      description: "Descrição original",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(
      <CategoryForm
        open={true}
        onOpenChange={mockOnOpenChange}
        category={category}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Categoria Atualizada" },
    });

    const submitButton = screen.getByRole("button", { name: /atualizar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("deve permitir criar categoria sem descrição", async () => {
    render(
      <CategoryForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Categoria Sem Descrição" },
    });

    const submitButton = screen.getByRole("button", { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Categoria Sem Descrição",
        })
      );
    });
  });

  it("deve chamar onOpenChange quando clicar em cancelar", () => {
    render(
      <CategoryForm
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
      <CategoryForm
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

  it("deve resetar o formulário após criar categoria", async () => {
    render(
      <CategoryForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByLabelText("Nome *");
    fireEvent.change(nameInput, {
      target: { value: "Nova Categoria" },
    });

    const submitButton = screen.getByRole("button", { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // O formulário deve ser resetado após submit bem-sucedido
    await waitFor(() => {
      expect(nameInput).toHaveValue("");
    });
  });
});
