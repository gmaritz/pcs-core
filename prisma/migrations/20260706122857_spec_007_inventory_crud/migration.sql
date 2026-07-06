-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_warehouseId_fkey";

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
