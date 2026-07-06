/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `warehouses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `warehouses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "warehouses" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "suburb" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_slug_key" ON "warehouses"("slug");
