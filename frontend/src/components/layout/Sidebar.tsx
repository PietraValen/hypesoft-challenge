"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Store,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    title: "Painel",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produtos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/dashboard/categories",
    icon: Store,
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-shopSense-primary text-white">
            <span className="text-lg font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-foreground">ShopSense</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {/* Navigation Items */}
        <div className="mb-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-shopSense-primary/10 text-shopSense-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-shopSense-primary" : "text-muted-foreground"
                    )}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ShopSense Pro Card */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-gradient-to-br from-shopSense-primary to-shopSense-primary-dark p-4 text-white">
          <div className="mb-2 flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span className="font-semibold">ShopSense Pro</span>
          </div>
          <p className="mb-3 text-xs text-white/90">
            Tenha Pro e aproveite mais de 20 recursos para impulsionar suas vendas. Teste grátis por 30 dias!
          </p>
          <Button
            size="sm"
            className="w-full bg-white text-shopSense-primary hover:bg-white/90"
          >
            Assinar Plano
          </Button>
        </div>
      </div>
    </div>
  );
}
