"use server";

import prisma from "@/lib/prisma";
import { CartItem } from "@/types/product.type";
import { PaymentMethodType, TransactionType } from "@prisma/client";

export async function getSales() {
  return await prisma.sale.findMany({
    include: {
      saleItems: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function createSale({
  cart,
  customerName = "unknown",
  paymentMethod = "CASH",
  amountPaid,
}: {
  cart: CartItem[];
  customerName: string;
  paymentMethod: PaymentMethodType;
  amountPaid: number;
}) {
  if (!cart || cart.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
  const change = amountPaid - totalAmount;

  return await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({
      data: {
        customerName,
        paymentMethod,
        amountPaid,
        totalAmount,
        change,
      },
    });

    for (const item of cart) {
      const { id: productId, quantity, price, total } = item;

      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error(`Product with ID ${productId} does not exist`);
      }

      await tx.saleItem.create({
        data: {
          saleId: sale.id,
          productId,
          quantity,
          price,
          total,
        },
      });

      await tx.transaction.create({
        data: {
          productId,
          type: TransactionType.SALE,
          quantity: -quantity,
          reason: `Sale to ${customerName}`,
        },
      });
    }

    return sale;
  });
}
