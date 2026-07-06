/*
  Warnings:

  - You are about to drop the column `currencyCode` on the `supplier_products` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `supplier_products` table. All the data in the column will be lost.
  - You are about to drop the column `supplierBarcode` on the `supplier_products` table. All the data in the column will be lost.
  - You are about to drop the column `supplierDescription` on the `supplier_products` table. All the data in the column will be lost.
  - You are about to drop the column `supplierName` on the `supplier_products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supplierId,productVariantId]` on the table `supplier_products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "supplier_products_supplierId_supplierSku_key";

-- AlterTable
ALTER TABLE "supplier_products" DROP COLUMN "currencyCode",
DROP COLUMN "status",
DROP COLUMN "supplierBarcode",
DROP COLUMN "supplierDescription",
DROP COLUMN "supplierName",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "currency" TEXT DEFAULT 'ZAR',
ADD COLUMN     "supplierProductName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "supplier_products_supplierId_productVariantId_key" ON "supplier_products"("supplierId", "productVariantId");
