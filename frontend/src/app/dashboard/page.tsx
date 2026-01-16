"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProductsByCategoryChart } from "@/components/dashboard/ProductsByCategoryChart";
import { LowStockList } from "@/components/dashboard/LowStockList";
import { useDashboardStats } from "@/hooks/useDashboard";
import { Package, Users, Eye, TrendingUp, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils/format";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Vendas Totais"
              value={
                stats
                  ? formatCurrency(stats.totalStockValue * 0.3, stats.currency)
                  : formatCurrency(0)
              }
              change={{
                value: "8% em relação ao mês passado",
                isPositive: true,
              }}
              icon={ShoppingBag}
            />
            <StatsCard
              title="Total de Produtos"
              value={stats?.totalProducts || 0}
              change={{
                value: "20% em relação ao mês passado",
                isPositive: true,
              }}
              icon={Package}
            />
            <StatsCard
              title="Produtos com Estoque Baixo"
              value={stats?.lowStockProductsCount || 0}
              change={{
                value: "Ação necessária",
                isPositive: false,
              }}
              icon={Eye}
              iconColor="text-orange-500"
            />
            <StatsCard
              title="Total de Categorias"
              value={stats?.totalCategories || 0}
              icon={Users}
            />
          </>
        )}
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <ProductsByCategoryChart />
        <LowStockList />
      </div>
    </div>
  );
}
