/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `media` table. All the data in the column will be lost.
  - Added the required column `extension` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_productId_fkey";

-- DropIndex
DROP INDEX "media_productId_idx";

-- DropIndex
DROP INDEX "media_status_idx";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "isPrimary",
DROP COLUMN "productId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "extension" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalFilename" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "width" INTEGER;

-- CreateIndex
CREATE INDEX "media_filename_idx" ON "media"("filename");
