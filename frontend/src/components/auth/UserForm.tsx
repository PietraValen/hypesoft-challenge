"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, CreateUserDto, UpdateUserDto } from "@/types/auth";
import {
  createUserSchema,
  updateUserSchema,
} from "@/lib/utils/validation";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void;
  isLoading?: boolean;
}

export function UserForm({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading = false,
}: UserFormProps) {
  const isEditing = !!user;

  const schema = isEditing ? updateUserSchema : createUserSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserDto | UpdateUserDto>({
    resolver: zodResolver(schema),
    defaultValues: user
      ? {
          username: user.username,
          email: user.email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          enabled: user.enabled,
          emailVerified: user.emailVerified,
        }
      : {
          enabled: true,
          emailVerified: false,
        },
  });

  const enabled = watch("enabled");
  const emailVerified = watch("emailVerified");

  // Type-safe access to password error (only exists when creating, not editing)
  const passwordError = !isEditing && "password" in errors 
    ? (errors as Record<string, { message?: string }>).password 
    : undefined;

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        enabled: user.enabled,
        emailVerified: user.emailVerified,
      });
    } else {
      reset({
        enabled: true,
        emailVerified: false,
      });
    }
  }, [user, reset]);

  const onFormSubmit = (data: CreateUserDto | UpdateUserDto) => {
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
            {isEditing ? "Editar Usuário" : "Criar Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do usuário"
              : "Preencha os dados para criar um novo usuário"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário *</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="nome.usuario"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="usuario@exemplo.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Nome"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome *</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Sobrenome"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Mínimo 8 caracteres com maiúscula e número"
                disabled={isLoading}
              />
              {passwordError && (
                <p className="text-sm text-red-500">
                  {passwordError.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                A senha deve ter no mínimo 8 caracteres, incluindo pelo menos
                uma letra maiúscula, uma minúscula e um número.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enabled">Status</Label>
              <Select
                value={enabled?.toString() || "true"}
                onValueChange={(value) =>
                  setValue("enabled", value === "true", {
                    shouldValidate: true,
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Habilitado</SelectItem>
                  <SelectItem value="false">Desabilitado</SelectItem>
                </SelectContent>
              </Select>
              {errors.enabled && (
                <p className="text-sm text-red-500">{errors.enabled.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailVerified">Email Verificado</Label>
              <Select
                value={emailVerified?.toString() || "false"}
                onValueChange={(value) =>
                  setValue("emailVerified", value === "true", {
                    shouldValidate: true,
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Verificado</SelectItem>
                  <SelectItem value="false">Não Verificado</SelectItem>
                </SelectContent>
              </Select>
              {errors.emailVerified && (
                <p className="text-sm text-red-500">
                  {errors.emailVerified.message}
                </p>
              )}
            </div>
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
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
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
