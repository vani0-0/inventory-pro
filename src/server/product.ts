"use server";

import prisma from "@/lib/prisma";
import { AddProductSchema, addProductSchema } from "@/lib/zod";
import {
  ProductCashier,
  ProductStatus,
  ProductTable,
} from "@/types/product.type";
import { subWeeks } from "date-fns";
import { z } from "zod";

export async function getOverviews() {
  const oneWeekAgo = subWeeks(new Date(), 1);

  // Sum quantity as is (positive for purchases/returns, negative for sales/adjustments)
  const currentStocks = await prisma.$queryRaw<
    {
      productId: string;
      quantity: bigint;
    }[]
  >`
    SELECT "productId",
      COALESCE(SUM(quantity), 0) AS quantity
    FROM transactions
    GROUP BY "productId"
  `;

  const lastWeekStocks = await prisma.$queryRaw<
    {
      productId: string;
      quantity: bigint;
    }[]
  >`
    SELECT "productId",
      COALESCE(SUM(quantity), 0) AS quantity
    FROM transactions
    WHERE "createdAt" <= ${oneWeekAgo}
    GROUP BY "productId"
  `;

  function countStatus(stocks: { productId: string; quantity: bigint }[]) {
    let total = 0,
      lowStock = 0,
      outOfStock = 0;

    for (const s of stocks) {
      const qty = Number(s.quantity) || 0;
      if (qty === 0) {
        outOfStock++;
      } else if (qty < 5) {
        lowStock++;
        total++;
      } else {
        total++;
      }
    }

    return { total, lowStock, outOfStock };
  }

  const current = countStatus(currentStocks);
  const lastWeek = countStatus(lastWeekStocks);

  return {
    total: {
      value: current.total,
      diff: current.total - lastWeek.total,
    },
    lowStock: {
      value: current.lowStock,
      diff: current.lowStock - lastWeek.lowStock,
    },
    outOfStock: {
      value: current.outOfStock,
      diff: current.outOfStock - lastWeek.outOfStock,
    },
  };
}

export async function getProductsForeSale(): Promise<ProductCashier[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stocks = await prisma.$queryRaw<
    {
      productId: string;
      quantity: bigint;
    }[]
  >`
    SELECT "productId",
      COALESCE(SUM(quantity), 0) AS quantity
    FROM transactions
    GROUP BY "productId"
  `;

  const stockMap = new Map(
    stocks.map((s) => [s.productId, Number(s.quantity)])
  );

  return products.map((product) => {
    const quantity = stockMap.get(product.id) ?? 0;
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: quantity,
      category: product.category,
    } satisfies ProductCashier;
  });
}

export async function getProducts(): Promise<ProductTable[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stocks = await prisma.$queryRaw<
    {
      productId: string;
      quantity: bigint;
    }[]
  >`
    SELECT "productId",
      COALESCE(SUM(quantity), 0) AS quantity
    FROM transactions
    GROUP BY "productId"
  `;

  const stockMap = new Map(
    stocks.map((s) => [s.productId, Number(s.quantity)])
  );

  return products.map((product) => {
    const quantity = stockMap.get(product.id) ?? 0;
    const orderLevel = product.orderLevel ?? 5;
    let status: ProductStatus = "In Stock";
    if (quantity === 0) status = "Out of Stock";
    else if (quantity < orderLevel) status = "Low Stock";

    return {
      ...product,
      quantity,
      status,
    };
  });
}

export async function addProduct(data: AddProductSchema) {
  try {
    const parsedData = addProductSchema.parse(data);

    const product = await prisma.product.upsert({
      where: { sku: parsedData.sku },
      update: {
        name: parsedData.name,
        category: parsedData.category,
        description: parsedData.description,
        price: parsedData.price,
        orderLevel: parsedData.reorderLevel,
      },
      create: {
        sku: parsedData.sku,
        name: parsedData.name,
        category: parsedData.category,
        description: parsedData.description,
        price: parsedData.price,
        orderLevel: parsedData.reorderLevel,
      },
    });

    await prisma.transaction.create({
      data: {
        type: "PURCHASE",
        quantity: parsedData.quantity,
        product: {
          connect: {
            id: product.id,
          },
        },
      },
    });

    return product;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map((e) => e.message).join(", "));
    }
    throw error;
  }
}

export async function addBulkProduct(data: AddProductSchema[]) {
  const results = await Promise.allSettled(
    data.map((item) => addProduct(item))
  );

  const successful = results.filter((result) => result.status === "fulfilled");
  const failed = results.filter((result) => result.status === "rejected");

  return { successful, failed };
}
