"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductFilters } from "@/components/products/ProductFilters";
import { StockUpdateDialog } from "@/components/products/StockUpdateDialog";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useUpdateStock,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { Product } from "@/types/product";
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateStockDto,
} from "@/lib/api/products";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, isLoading } = useProducts({
    pageNumber: page,
    pageSize: 10,
    categoryId: categoryId || undefined,
    status,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const updateStockMutation = useUpdateStock();
  const deleteMutation = useDeleteProduct();

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateStock = (product: Product) => {
    setSelectedProduct(product);
    setIsStockDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateProductDto | UpdateProductDto) => {
    if (selectedProduct) {
      updateMutation.mutate(
        { id: selectedProduct.id, data: data as UpdateProductDto },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setSelectedProduct(null);
          },
        }
      );
    } else {
      createMutation.mutate(data as CreateProductDto, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleStockSubmit = (data: UpdateStockDto) => {
    if (selectedProduct) {
      updateStockMutation.mutate(
        { id: selectedProduct.id, data },
        {
          onSuccess: () => {
            setIsStockDialogOpen(false);
            setSelectedProduct(null);
          },
        }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedProduct(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">
            Gerencie seus produtos e estoque
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        status={status}
        onStatusChange={setStatus}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : data ? (
        <ProductTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateStock={handleUpdateStock}
          onPageChange={setPage}
        />
      ) : (
        <div className="text-center text-muted-foreground">
          Erro ao carregar produtos
        </div>
      )}

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct || undefined}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <StockUpdateDialog
        open={isStockDialogOpen}
        onOpenChange={setIsStockDialogOpen}
        product={selectedProduct}
        onSubmit={handleStockSubmit}
        isLoading={updateStockMutation.isPending}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto{" "}
              <strong>{selectedProduct?.name}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
