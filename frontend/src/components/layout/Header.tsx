"use client";

import { useState, useEffect } from "react";
import { Search, Sun, Moon, Bell, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/keycloak/hooks";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Painel" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Atalho de teclado para busca (⌘S ou Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        const searchInput = document.getElementById("search-input");
        searchInput?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userInitials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="sticky top-0 z-10 border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>

        {/* Search Bar */}
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-input"
              type="search"
              placeholder="Pesquisar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
              <span className="text-xs">⌘</span>S
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            <span className="sr-only">Notificações</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-shopSense-primary text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left sm:flex">
                  <span className="text-sm font-medium">{user?.name || "Usuário"}</span>
                  <span className="text-xs text-muted-foreground">
                    Administrador da Loja
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "Usuário"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Mais opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuItem>Atalhos de teclado</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Date Range and Filters (optional) */}
      <div className="flex items-center justify-between border-t px-6 py-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            6 de Mai - 6 de Jun
          </span>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <span>Filtrar</span>
        </Button>
      </div>
    </header>
  );
}
