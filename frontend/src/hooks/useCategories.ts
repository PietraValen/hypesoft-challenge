import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  type CreateCategoryDto,
  type UpdateCategoryDto,
} from "@/lib/api/categories";
import { useToast } from "@/hooks/use-toast";

// Query Keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  products: (id: string) => [...categoryKeys.detail(id), "products"] as const,
};

/**
 * Hook para listar todas as categorias
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para obter uma categoria por ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}

/**
 * Hook para obter produtos de uma categoria
 */
export function useCategoryProducts(categoryId: string) {
  return useQuery({
    queryKey: categoryKeys.products(categoryId),
    queryFn: () => getProductsByCategory(categoryId),
    enabled: !!categoryId,
  });
}

/**
 * Hook para criar uma categoria
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar categoria",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para atualizar uma categoria
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(data.id) });
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar categoria",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para excluir uma categoria
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao excluir categoria",
        variant: "destructive",
      });
    },
  });
}
