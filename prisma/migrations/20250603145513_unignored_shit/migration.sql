/*
  Warnings:

  - You are about to drop the `ProductStock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductStock" DROP CONSTRAINT "ProductStock_productId_fkey";

-- DropTable
DROP TABLE "ProductStock";

-- CreateTable
CREATE TABLE "product_stock" (
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "product_stock_pkey" PRIMARY KEY ("productId")
);

-- AddForeignKey
ALTER TABLE "product_stock" ADD CONSTRAINT "product_stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
