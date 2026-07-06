/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "suppliers" RENAME COLUMN "phone" TO "telephone";

ALTER TABLE "suppliers" ADD COLUMN "slug" TEXT;

-- Backfill `slug` from supplier name and ensure uniqueness for existing rows.
WITH ranked_slugs AS (
  SELECT
    "id",
    CASE
      WHEN base_slug = '' THEN 'supplier'
      ELSE base_slug
    END AS normalized_slug,
    ROW_NUMBER() OVER (
      PARTITION BY CASE WHEN base_slug = '' THEN 'supplier' ELSE base_slug END
      ORDER BY "createdAt", "id"
    ) AS rank_number
  FROM (
    SELECT
      "id",
      "createdAt",
      TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(COALESCE("name", ''), '[^a-zA-Z0-9]+', '-', 'g'))) AS base_slug
    FROM "suppliers"
  ) AS base
)
UPDATE "suppliers" AS supplier
SET "slug" = CASE
  WHEN ranked_slugs.rank_number = 1
    THEN ranked_slugs.normalized_slug
  ELSE ranked_slugs.normalized_slug || '-' || ranked_slugs.rank_number
END
FROM ranked_slugs
WHERE supplier."id" = ranked_slugs."id";

ALTER TABLE "suppliers" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_slug_key" ON "suppliers"("slug");
