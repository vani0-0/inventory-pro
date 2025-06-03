"use client";

import { ProductTable } from "@/types/product.type";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ProductTable>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "sku", header: "SKU / Barcode" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "quantity", header: "Quantity" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "status", header: "Status" },
];
