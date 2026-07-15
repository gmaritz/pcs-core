# Seed Data Framework

The seed framework loads the canonical dataset from data/canonical and writes deterministic records into PostgreSQL via Prisma.

## Commands
- npm run seed: seed canonical data without reset.
- npm run seed:reset: clear seed scope and then seed canonical data.
- npm run seed:validate: validate current database state against MVP-002 rules.
- npm run validate:mvp-002: run build, seed reset and validation in sequence.

## Seed Order
1. Sports
2. Categories
3. Brands
4. Attributes
5. Suppliers
6. Products
7. Product Variants
8. Media
9. Inventory
10. Pricing and Supplier Product mapping
11. Customers
12. Orders

## Outputs
- docs/validation/MVP-002/seed-validation-report.md
- docs/validation/MVP-002/reports/YYYY-MM-DD-HHMM.md

## Determinism and Idempotency
- Primary entities are upserted by canonical business keys.
- Variant SKU, product codes and order numbers are deterministic.
- Re-running seed updates canonical records without creating duplicates.
- seed:reset ensures a clean canonical-only state for local validation.
