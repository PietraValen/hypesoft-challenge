"use client";

import { useState } from "react";
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
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmPassword: z.string(),
  temporary: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: { id: string; username: string; firstName?: string; lastName?: string };
  onSubmit: (data: { password: string; temporary: boolean }) => void;
  isLoading?: boolean;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading = false,
}: ResetPasswordDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      temporary: false,
    },
  });

  const temporary = watch("temporary");

  const onFormSubmit = (data: ResetPasswordFormData) => {
    onSubmit({
      password: data.password,
      temporary: data.temporary,
    });
    reset();
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const userName = user
    ? user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user.username
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redefinir Senha</DialogTitle>
          <DialogDescription>
            {user
              ? `Defina uma nova senha para o usuário ${userName}.`
              : "Defina uma nova senha para o usuário."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha *</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Mínimo 8 caracteres com maiúscula e número"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma
              letra maiúscula, uma minúscula e um número.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Digite a senha novamente"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="temporary"
              checked={temporary}
              onChange={(e) => setValue("temporary", e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="temporary" className="text-sm font-normal">
              Senha temporária (usuário precisará alterar no próximo login)
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
