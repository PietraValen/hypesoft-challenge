"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { KeycloakProvider } from "@/lib/keycloak/provider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="shopsense-ui-theme">
      <KeycloakProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </KeycloakProvider>
    </ThemeProvider>
  );
}
