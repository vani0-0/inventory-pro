import { z } from "zod";

export const productCategorySchema = z.enum([
  "Electronics",
  "Clothing",
  "Foods & Beverages",
  "Office Supplies",
  "Others",
]);

export const addProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: productCategorySchema,
  storageLocation: z.string().min(1, "Storage location is required"),
  quantity: z.number().min(0, "Quantity must be a non-negative number"),
  price: z.number().min(0, "Price must be a positive number"),
  reorderLevel: z
    .number()
    .min(0, "Reorder level must be a non-negative number"),
  supplier: z.string().min(1, "Supplier is required"),
  description: z.string().optional(),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;
export type ProductCategorySchema = z.infer<typeof productCategorySchema>;
