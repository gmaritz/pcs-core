/*
  Warnings:

  - You are about to drop the column `paidAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `payments` table. All the data in the column will be lost.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[paymentReference]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `method` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentReference` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentChannel" AS ENUM ('EFT', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'PAYFAST', 'PAYGATE', 'YOCO', 'OZOW');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paidAt",
DROP COLUMN "reference",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'ZAR',
ADD COLUMN     "method" "PaymentChannel" NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentReference" TEXT NOT NULL,
ADD COLUMN     "transactionReference" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentReference_key" ON "payments"("paymentReference");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");
