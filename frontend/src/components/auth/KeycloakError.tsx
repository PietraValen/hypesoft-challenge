"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeycloakErrorProps {
  error?: string;
}

export function KeycloakError({ error }: KeycloakErrorProps) {
  const isClientNotFound = 
    error?.includes("Client not found") || 
    error?.includes("invalid_client");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle>Erro de Configuração do Keycloak</CardTitle>
          </div>
          <CardDescription>
            O Keycloak não está configurado corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isClientNotFound && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Client não encontrado
              </h3>
              <p className="text-sm text-yellow-700 mb-4">
                O cliente <code className="bg-yellow-100 px-2 py-1 rounded">hypesoft-frontend</code> não foi encontrado no realm <code className="bg-yellow-100 px-2 py-1 rounded">hypesoft</code>.
              </p>
              <div className="bg-white rounded p-4 space-y-3">
                <h4 className="font-semibold text-gray-800">Siga estes passos para resolver:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Acesse o Keycloak Admin: <a href="http://localhost:8080" target="_blank" className="text-blue-600 hover:underline">http://localhost:8080</a></li>
                  <li>Faça login com: <code className="bg-gray-100 px-1 rounded">admin</code> / <code className="bg-gray-100 px-1 rounded">admin</code></li>
                  <li>Crie o realm <code className="bg-gray-100 px-1 rounded">hypesoft</code></li>
                  <li>Crie o client <code className="bg-gray-100 px-1 rounded">hypesoft-frontend</code> como Public Client</li>
                  <li>Configure as URLs de redirecionamento: <code className="bg-gray-100 px-1 rounded">http://localhost:3000/*</code></li>
                </ol>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-semibold">Documentação:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>
                <a 
                  href="https://github.com/your-repo/blob/main/KEYCLOAK_QUICK_SETUP.md" 
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Guia Rápido de Configuração
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/your-repo/blob/main/frontend/KEYCLOAK_SETUP.md" 
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Guia Completo de Configuração
                </a>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Tentar Novamente
            </Button>
          </div>

          {error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Detalhes do erro
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
