"use client";

import { ProductTable } from "@/types/product.type";
import { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "./table-actions";

export const columns: ColumnDef<ProductTable>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "sku", header: "SKU / Barcode" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "quantity", header: "Quantity" },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) =>
      new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(info.getValue() as number),
  },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    cell: ({ row }) => {
      return <TableActions data={row.original as ProductTable} />;
    },
  },
];
