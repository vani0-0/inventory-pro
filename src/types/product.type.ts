export type ProductTable = {
  quantity: number;
  status: ProductStatus;
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductCashier = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
};

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
}

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";
