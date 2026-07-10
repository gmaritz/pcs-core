/*
  Warnings:

  - You are about to drop the column `lineTotal` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "lineTotal",
DROP COLUMN "productName",
DROP COLUMN "sku",
ADD COLUMN     "totalPrice" DECIMAL(10,2),
ALTER COLUMN "unitPrice" DROP NOT NULL;
