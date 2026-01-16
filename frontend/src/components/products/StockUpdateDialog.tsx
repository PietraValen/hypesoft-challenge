"use client";

import React, { useEffect } from "react";
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
import { Product } from "@/types/product";
import { updateStockSchema } from "@/lib/utils/validation";
import { UpdateStockDto } from "@/lib/api/products";

interface StockUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmit: (data: UpdateStockDto) => void;
  isLoading?: boolean;
}

export function StockUpdateDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading = false,
}: StockUpdateDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateStockDto>({
    resolver: zodResolver(updateStockSchema),
    defaultValues: {
      quantity: product?.stockQuantity || 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        quantity: product.stockQuantity,
      });
    }
  }, [product, reset]);

  const onFormSubmit = (data: UpdateStockDto) => {
    onSubmit(data);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Estoque</DialogTitle>
          <DialogDescription>
            Atualize a quantidade em estoque do produto {product.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade em Estoque</Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Estoque atual: {product.stockQuantity} unidades
            </p>
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
              {isLoading ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
