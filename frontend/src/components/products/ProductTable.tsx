"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Package } from "lucide-react";
import { Product, ProductStatus } from "@/types/product";
import { formatCurrency } from "@/lib/utils/format";
import { PagedResult } from "@/types/api";

interface ProductTableProps {
  data: PagedResult<Product>;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
  onPageChange: (page: number) => void;
}

export function ProductTable({
  data,
  onEdit,
  onDelete,
  onUpdateStock,
  onPageChange,
}: ProductTableProps) {
  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.Active:
        return <Badge variant="default">Ativo</Badge>;
      case ProductStatus.Inactive:
        return <Badge variant="secondary">Inativo</Badge>;
      case ProductStatus.Discontinued:
        return <Badge variant="destructive">Descontinuado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getStockBadge = (product: Product) => {
    if (product.isOutOfStock) {
      return <Badge variant="destructive">Sem estoque</Badge>;
    }
    if (product.isLowStock) {
      return <Badge variant="default" className="bg-orange-500">Estoque baixo</Badge>;
    }
    return <Badge variant="secondary">{product.stockQuantity} unidades</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categoryName || "N/A"}</TableCell>
                  <TableCell>
                    {formatCurrency(product.price, product.currency)}
                  </TableCell>
                  <TableCell>{getStockBadge(product)}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStock(product)}>
                          <Package className="mr-2 h-4 w-4" />
                          Atualizar Estoque
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(product)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {data.items.length} de {data.totalCount} produtos
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(data.pageNumber - 1)}
              disabled={!data.hasPreviousPage}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Página {data.pageNumber} de {data.totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(data.pageNumber + 1)}
              disabled={!data.hasNextPage}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
