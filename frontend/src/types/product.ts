export enum ProductStatus {
  Active = 1,
  Inactive = 2,
  Discontinued = 3,
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  categoryId: string;
  categoryName?: string;
  stockQuantity: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}
