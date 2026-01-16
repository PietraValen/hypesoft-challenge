"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types/category";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/utils/validation";
import { useEffect } from "react";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/lib/api/categories";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => void;
  isLoading?: boolean;
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const isEditing = !!category;
  const schema = isEditing ? updateCategorySchema : createCategorySchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCategoryDto | UpdateCategoryDto>({
    resolver: zodResolver(schema),
    defaultValues: category
      ? {
          name: category.name,
          description: category.description || "",
        }
      : {},
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
      });
    } else {
      reset({});
    }
  }, [category, reset]);

  const onFormSubmit = (data: CreateCategoryDto | UpdateCategoryDto) => {
    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoria" : "Criar Categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da categoria"
              : "Preencha os dados para criar uma nova categoria"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nome da categoria"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descrição da categoria"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Salvando..."
                : isEditing
                ? "Atualizar"
                : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
