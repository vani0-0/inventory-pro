import prisma from "@/lib/prisma";

export async function getTransactions() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });
  return transactions;
}
