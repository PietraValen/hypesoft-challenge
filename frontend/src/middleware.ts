import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware do Next.js para proteger rotas
 * 
 * Nota: A verificação de autenticação real é feita no lado do cliente
 * através do componente ProtectedRoute, pois o Keycloak armazena tokens
 * na memória do navegador, não em cookies.
 * 
 * Este middleware apenas garante que rotas públicas sejam acessíveis
 * e prepara o ambiente para a verificação no cliente.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    "/login",
    "/api/auth",
    "/silent-check-sso.html",
  ];

  // Verifica se a rota é pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Permite acesso a rotas públicas
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Para rotas protegidas, a verificação será feita no cliente
  // através do componente ProtectedRoute
  return NextResponse.next();
}

/**
 * Configuração do matcher para o middleware
 * Define quais rotas devem ser processadas pelo middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
