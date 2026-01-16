"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryList } from "@/components/categories/CategoryList";
import { CategoryForm } from "@/components/categories/CategoryForm";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { Category } from "@/types/category";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/lib/api/categories";
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
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useCategories();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleViewProducts = (category: Category) => {
    router.push(`/dashboard/products?categoryId=${category.id}`);
  };

  const handleFormSubmit = (data: CreateCategoryDto | UpdateCategoryDto) => {
    if (selectedCategory) {
      updateMutation.mutate(
        { id: selectedCategory.id, data: data as UpdateCategoryDto },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setSelectedCategory(null);
          },
        }
      );
    } else {
      createMutation.mutate(data as CreateCategoryDto, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedCategory(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">
            Gerencie as categorias de produtos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : categories ? (
        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewProducts={handleViewProducts}
        />
      ) : (
        <div className="text-center text-muted-foreground">
          Erro ao carregar categorias
        </div>
      )}

      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory || undefined}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria{" "}
              <strong>{selectedCategory?.name}</strong>? Esta ação não pode ser
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
