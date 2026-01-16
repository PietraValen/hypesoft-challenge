"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDashboardLowStock } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LowStockList() {
  const { data, isLoading, error } = useDashboardLowStock();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-shopSense-primary" />
            Produtos com Estoque Baixo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-shopSense-primary" />
            Produtos com Estoque Baixo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum produto com estoque baixo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-shopSense-primary" />
          Low Stock Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 5).map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.categoryName || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.isOutOfStock
                        ? "destructive"
                        : product.isLowStock
                        ? "default"
                        : "secondary"
                    }
                  >
                    {product.stockQuantity} unidades
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatCurrency(product.price, product.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length > 5 && (
          <div className="mt-4 text-center">
            <Link href="/dashboard/products?filter=low-stock">
              <Button variant="outline" size="sm">
                Ver Todos ({data.length})
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
