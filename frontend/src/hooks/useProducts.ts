import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  searchProducts,
  getLowStockProducts,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  type GetProductsParams,
  type CreateProductDto,
  type UpdateProductDto,
  type UpdateStockDto,
} from "@/lib/api/products";
import { useToast } from "@/hooks/use-toast";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: GetProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (term: string) => [...productKeys.all, "search", term] as const,
  lowStock: () => [...productKeys.all, "low-stock"] as const,
};

/**
 * Hook para listar produtos com paginação
 */
export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obter um produto por ID
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

/**
 * Hook para buscar produtos por nome
 */
export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: productKeys.search(searchTerm),
    queryFn: () => searchProducts(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obter produtos com estoque baixo
 */
export function useLowStockProducts() {
  return useQuery({
    queryKey: productKeys.lowStock(),
    queryFn: getLowStockProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para criar um produto
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProductDto) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() });
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar produto",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para atualizar um produto
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar produto",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para atualizar estoque
 */
export function useUpdateStock() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStockDto }) =>
      updateStock(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() });
      toast({
        title: "Sucesso",
        description: "Estoque atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar estoque",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook para excluir um produto
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() });
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao excluir produto",
        variant: "destructive",
      });
    },
  });
}
