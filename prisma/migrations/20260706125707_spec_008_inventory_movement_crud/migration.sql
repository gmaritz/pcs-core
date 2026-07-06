/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `inventory_movements` table. All the data in the column will be lost.
  - Added the required column `movementType` to the `inventory_movements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT');

-- DropIndex
DROP INDEX "inventory_movements_createdAt_idx";

-- AlterTable
ALTER TABLE "inventory_movements" DROP COLUMN "updatedAt",
ADD COLUMN     "movementType" "InventoryMovementType" NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "inventory_movements_movementType_idx" ON "inventory_movements"("movementType");
