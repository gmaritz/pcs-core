-- AlterTable
ALTER TABLE "customers"
RENAME COLUMN "phone" TO "telephone";

-- AlterTable
ALTER TABLE "customers"
ADD COLUMN "company" TEXT;
