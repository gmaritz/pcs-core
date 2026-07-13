-- AlterTable
ALTER TABLE "product_variants"
ADD COLUMN "supplierCost" DECIMAL(10,2),
ADD COLUMN "markupPercentage" DECIMAL(5,2) NOT NULL DEFAULT 35,
ADD COLUMN "manualPriceOverride" BOOLEAN NOT NULL DEFAULT false;
