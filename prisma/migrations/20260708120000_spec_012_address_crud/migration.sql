-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('SHIPPING', 'BILLING');

-- AlterTable
ALTER TABLE "addresses"
ADD COLUMN "type" "AddressType" NOT NULL DEFAULT 'SHIPPING',
ADD COLUMN "contactName" TEXT,
ADD COLUMN "contactPhone" TEXT,
ADD COLUMN "company" TEXT;

-- Ensure existing rows satisfy non-null province requirement.
UPDATE "addresses"
SET "province" = 'N/A'
WHERE "province" IS NULL;

-- AlterTable
ALTER TABLE "addresses"
ALTER COLUMN "province" SET NOT NULL,
DROP COLUMN "isDefault";
