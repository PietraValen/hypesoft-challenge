"use client";

import { useForm, type FieldErrors } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelect } from "@/components/categories/CategorySelect";
import { Textarea } from "@/components/ui/textarea";
import { Product, ProductStatus } from "@/types/product";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductDto,
  type UpdateProductDto,
} from "@/lib/utils/validation";
import { useEffect } from "react";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => void;
  isLoading?: boolean;
}

export function ProductForm({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const isEditing = !!product;

  const schema = isEditing ? updateProductSchema : createProductSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateProductDto | UpdateProductDto>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          price: product.price,
          currency: product.currency,
          categoryId: product.categoryId,
          status: product.status,
        }
      : {
          currency: "BRL",
        },
  });

  const categoryId = watch("categoryId");

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        price: product.price,
        currency: product.currency,
        categoryId: product.categoryId,
        status: product.status,
      });
    } else {
      reset({
        currency: "BRL",
      });
    }
  }, [product, reset]);

  const onFormSubmit = (data: CreateProductDto | UpdateProductDto) => {
    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Produto" : "Criar Produto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do produto"
              : "Preencha os dados para criar um novo produto"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nome do produto"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descrição do produto"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria *</Label>
              <CategorySelect
                value={categoryId}
                onValueChange={(value) => setValue("categoryId", value)}
                placeholder="Selecione uma categoria"
              />
              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select
                value={watch("currency") || "BRL"}
                onValueChange={(value) => setValue("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL (R$)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Quantidade em Estoque *</Label>
              <Input
                id="stockQuantity"
                type="number"
                {...register("stockQuantity", { valueAsNumber: true })}
                placeholder="0"
              />
              {(errors as FieldErrors<CreateProductDto>).stockQuantity && (
                <p className="text-sm text-red-500">
                  {(errors as FieldErrors<CreateProductDto>).stockQuantity?.message}
                </p>
              )}
            </div>
          )}

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")?.toString() || ProductStatus.Active.toString()}
                onValueChange={(value) =>
                  setValue("status", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductStatus.Active.toString()}>
                    Ativo
                  </SelectItem>
                  <SelectItem value={ProductStatus.Inactive.toString()}>
                    Inativo
                  </SelectItem>
                  <SelectItem value={ProductStatus.Discontinued.toString()}>
                    Descontinuado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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
