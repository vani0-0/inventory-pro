import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ product_id: string | null }> }
) {
  const { product_id } = await params;

  if (!product_id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 404 }
    );
  }

  const product = await prisma.product.findUnique({
    where: { sku: product_id },
    select: {
      id: true,
      name: true,
      sku: true,
    },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

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
  WHERE "productId" = ${product.id}
  GROUP BY "productId"
`;
  const quantity = stocks.length > 0 ? Number(stocks[0].quantity) : 0;

  const productWithStock = {
    product_name: product.name,
    product_id: product.sku,
    stock_quantity: quantity,
  };

  return NextResponse.json(productWithStock, { status: 200 });
}
