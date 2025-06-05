"use server";

import prisma from "@/lib/prisma";

export async function getTransactions() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          name: true,
        },
      },
    },
  });

  return transactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    item: transaction.product.name,
    quantity: transaction.quantity,
    timestamp: transaction.createdAt,
    reason: transaction.reason,
  }));
}
