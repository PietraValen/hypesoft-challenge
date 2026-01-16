"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  enabled?: boolean;
  onEnabledChange: (value: boolean | undefined) => void;
  emailVerified?: boolean;
  onEmailVerifiedChange: (value: boolean | undefined) => void;
}

export function UserFilters({
  searchTerm,
  onSearchChange,
  enabled,
  onEnabledChange,
  emailVerified,
  onEmailVerifiedChange,
}: UserFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Atualiza a busca quando o debounce termina
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const clearFilters = () => {
    setLocalSearch("");
    onSearchChange("");
    onEnabledChange(undefined);
    onEmailVerifiedChange(undefined);
  };

  const hasFilters = localSearch || enabled !== undefined || emailVerified !== undefined;

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou username..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select
        value={enabled === undefined ? "all" : enabled.toString()}
        onValueChange={(value) =>
          onEnabledChange(value === "all" ? undefined : value === "true")
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="true">Habilitados</SelectItem>
          <SelectItem value="false">Desabilitados</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={emailVerified === undefined ? "all" : emailVerified.toString()}
        onValueChange={(value) =>
          onEmailVerifiedChange(value === "all" ? undefined : value === "true")
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Verificação de email" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Verificados</SelectItem>
          <SelectItem value="false">Não verificados</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
