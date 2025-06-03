/*
  Warnings:

  - You are about to drop the `product_stock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_stock" DROP CONSTRAINT "product_stock_productId_fkey";

-- DropTable
DROP TABLE "product_stock";
