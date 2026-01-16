"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  placeholder = "Selecione uma categoria",
  disabled = false,
}: CategorySelectProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Nenhuma categoria disponível
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
