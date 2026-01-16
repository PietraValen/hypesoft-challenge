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
import { useCategories } from "@/hooks/useCategories";
import { ProductStatus } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryId?: string;
  onCategoryChange: (value: string) => void;
  status?: number;
  onStatusChange: (value: number | undefined) => void;
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  categoryId,
  onCategoryChange,
  status,
  onStatusChange,
}: ProductFiltersProps) {
  const { data: categories } = useCategories();
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Atualiza a busca quando o debounce termina
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const clearFilters = () => {
    setLocalSearch("");
    onSearchChange("");
    onCategoryChange("");
    onStatusChange(undefined);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select 
        value={categoryId || "all"} 
        onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status?.toString() || "all"}
        onValueChange={(value) =>
          onStatusChange(value === "all" ? undefined : parseInt(value))
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value={ProductStatus.Active.toString()}>Ativo</SelectItem>
          <SelectItem value={ProductStatus.Inactive.toString()}>
            Inativo
          </SelectItem>
          <SelectItem value={ProductStatus.Discontinued.toString()}>
            Descontinuado
          </SelectItem>
        </SelectContent>
      </Select>

      {(localSearch || categoryId || status) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
