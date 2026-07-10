/*
  Warnings:

  - You are about to drop the column `shoppingCartId` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the `shopping_carts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cartId,productVariantId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartId` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKED_OUT', 'ABANDONED');

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_shoppingCartId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_carts" DROP CONSTRAINT "shopping_carts_customerId_fkey";

-- DropIndex
DROP INDEX "cart_items_shoppingCartId_idx";

-- DropIndex
DROP INDEX "cart_items_shoppingCartId_productVariantId_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "shoppingCartId",
ADD COLUMN     "cartId" TEXT NOT NULL;

-- DropTable
DROP TABLE "shopping_carts";

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carts_customerId_key" ON "carts"("customerId");

-- CreateIndex
CREATE INDEX "carts_status_idx" ON "carts"("status");

-- CreateIndex
CREATE INDEX "cart_items_cartId_idx" ON "cart_items"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productVariantId_key" ON "cart_items"("cartId", "productVariantId");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
