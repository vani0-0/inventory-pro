import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      sku: true,
    },
  });
  const stocks = await prisma.$queryRaw<
    {
      productId: string;
      quantity: number;
    }[]
  >`
  SELECT "productId",
    SUM(
      CASE
        WHEN "type" IN ('PURCHASE', 'RETURN') THEN quantity
        ELSE -quantity
      END
    ) AS quantity
  FROM transactions
  GROUP BY "productId"
`;

  const stockMap = new Map(stocks.map((s) => [s.productId, s.quantity]));

  const productsWithStock = products.map((product) => {
    const quantity = stockMap.get(product.id) ?? 0;

    return {
      product_name: product.name,
      product_id: product.sku,
      stock_quantity: Number(quantity),
    };
  });

  return NextResponse.json(productsWithStock, { status: 200 });
}
