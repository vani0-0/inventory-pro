-- CreateTable
CREATE TABLE "ProductStock" (
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- AddForeignKey
ALTER TABLE "ProductStock" ADD CONSTRAINT "ProductStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
