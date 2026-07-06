/*
  Warnings:

  - A unique constraint covering the columns `[productVariantId]` on the table `inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "inventory_warehouseId_productVariantId_key";

-- AlterTable
ALTER TABLE "inventory" ALTER COLUMN "reorderLevel" SET DEFAULT 0,
ALTER COLUMN "warehouseId" DROP NOT NULL;

-- Backfill nullable reorder levels before making the column required.
UPDATE "inventory"
SET "reorderLevel" = 0
WHERE "reorderLevel" IS NULL;

-- AlterTable
ALTER TABLE "inventory" ALTER COLUMN "reorderLevel" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "inventory_productVariantId_key" ON "inventory"("productVariantId");
