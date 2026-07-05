/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "description" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_slug_key" ON "product_variants"("slug");

-- CreateIndex
CREATE INDEX "product_variants_displayOrder_idx" ON "product_variants"("displayOrder");
