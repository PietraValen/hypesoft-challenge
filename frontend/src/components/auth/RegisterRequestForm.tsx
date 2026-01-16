"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  registerRequestSchema,
  type RegisterRequestDto,
} from "@/lib/utils/validation";
import { registerRequest, type AuthError } from "@/lib/api/auth";

interface RegisterRequestFormProps {
  onSuccess?: () => void;
}

export function RegisterRequestForm({ onSuccess }: RegisterRequestFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterRequestDto>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      message: "",
    },
  });

  const onSubmit = async (data: RegisterRequestDto) => {
    setIsLoading(true);

    try {
      await registerRequest({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        message: data.message,
      });

      // Exibe mensagem de sucesso
      toast({
        title: "Solicitação enviada com sucesso!",
        description:
          "Sua solicitação de cadastro foi recebida. Você receberá um email quando sua conta for aprovada.",
      });

      setIsSubmitted(true);
      reset();

      // Chama callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage =
        "Erro ao enviar solicitação. Tente novamente mais tarde.";

      // Trata diferentes tipos de erro
      if (authError.error === "registration_error") {
        errorMessage =
          authError.error_description ||
          "Erro ao processar solicitação. Verifique os dados e tente novamente.";
      } else if (authError.error === "network_error") {
        errorMessage =
          "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (authError.error_description) {
        errorMessage = authError.error_description;
      }

      toast({
        title: "Erro ao enviar solicitação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Se já foi submetido com sucesso, mostra mensagem de confirmação
  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Solicitação enviada com sucesso!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Sua solicitação de cadastro foi recebida. Você receberá um
                  email quando sua conta for aprovada pelo administrador.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            className="mr-2"
          >
            Enviar outra solicitação
          </Button>
          <Link href="/login">
            <Button
              type="button"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Voltar para login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Digite seu nome"
            autoComplete="given-name"
            disabled={isLoading}
            {...register("firstName")}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Digite seu sobrenome"
            autoComplete="family-name"
            disabled={isLoading}
            {...register("lastName")}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu email"
          autoComplete="email"
          disabled={isLoading}
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Usuário</Label>
        <Input
          id="username"
          type="text"
          placeholder="Digite um nome de usuário"
          autoComplete="username"
          disabled={isLoading}
          {...register("username")}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Use apenas letras, números e underscore (mínimo 3 caracteres)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem (opcional)</Label>
        <Textarea
          id="message"
          placeholder="Descreva o motivo da sua solicitação de acesso..."
          rows={4}
          disabled={isLoading}
          {...register("message")}
          className={errors.message ? "border-red-500" : ""}
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Máximo de 500 caracteres
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="mr-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            Enviando...
          </>
        ) : (
          "Enviar Solicitação"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </form>
  );
}
