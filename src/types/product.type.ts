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

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";
