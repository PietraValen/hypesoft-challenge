"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginDto } from "@/lib/utils/validation";
import { useAuth } from "@/lib/keycloak/hooks";
import type { AuthError } from "@/lib/api/auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { loginWithCredentials } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true);

    try {
      // Realiza login usando o método do provider
      // Isso atualiza automaticamente o estado do Keycloak
      await loginWithCredentials({
        username: data.username,
        password: data.password,
      });

      // Exibe mensagem de sucesso
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando...",
      });

      // Chama callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess();
      } else {
        // Redireciona para a página de destino
        window.location.href = redirect;
      }
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      // Trata diferentes tipos de erro do Keycloak
      if (authError.error === "invalid_grant") {
        errorMessage =
          authError.error_description ||
          "Credenciais inválidas. Verifique seu usuário e senha.";
      } else if (authError.error === "invalid_client") {
        errorMessage = "Erro de configuração do cliente. Contate o administrador.";
      } else if (authError.error === "network_error") {
        errorMessage =
          "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (authError.error_description) {
        errorMessage = authError.error_description;
      }

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Usuário ou Email</Label>
        <Input
          id="username"
          type="text"
          placeholder="Digite seu usuário ou email"
          autoComplete="username"
          disabled={isLoading}
          {...register("username")}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          disabled={isLoading}
          {...register("password")}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
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
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            Solicite acesso
          </Link>
        </p>
      </div>
    </form>
  );
}
