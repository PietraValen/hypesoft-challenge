export interface DashboardStats {
  totalProducts: number;
  totalStockValue: number;
  currency: string;
  lowStockProductsCount: number;
  outOfStockProductsCount: number;
  totalCategories: number;
}

export interface CategoryProductCount {
  categoryId: string;
  categoryName: string;
  productCount: number;
}
