-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InventoryMovementType" ADD VALUE 'RELEASED';
ALTER TYPE "InventoryMovementType" ADD VALUE 'IMPORT';
ALTER TYPE "InventoryMovementType" ADD VALUE 'RETURN';

-- DropIndex
DROP INDEX "carts_customerId_key";

-- DropIndex
DROP INDEX "carts_status_idx";

-- CreateIndex
CREATE INDEX "carts_customerId_idx" ON "carts"("customerId");

-- CreateIndex
CREATE INDEX "carts_customerId_status_idx" ON "carts"("customerId", "status");
