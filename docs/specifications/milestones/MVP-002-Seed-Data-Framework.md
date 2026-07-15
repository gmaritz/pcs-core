# PCS Core Milestone Specification

Milestone:
MVP-002

Title:
Seed Data Framework

Version:
3.0

Status:
Implemented

Phase:
MVP Hardening

Author:
ChatGPT

---

# Objective

Implement a comprehensive Seed Data Framework that creates a realistic ecommerce environment for PCS Core.

The framework must provide consistent, repeatable and deterministic sample data for development, testing, demonstrations and supplier validation.

No production supplier feeds are used.

The framework simulates a production catalogue.

The Seed Framework consumes a Canonical Development Dataset, which becomes the authoritative reference dataset for PCS Core.

---

# Philosophy

The Canonical Development Dataset represents the reference implementation of the Pro Court Sports business domain.

Every developer should be able to execute a single command and obtain an identical database.

The framework must be

- Repeatable
- Deterministic
- Idempotent
- Extensible
- Supplier Independent

The Seed Framework generates the database.

The Canonical Dataset owns the data.

---

# Folder Structure

## Developer Tools

```
tools/

    database/

        seed/

            SeedRunner.ts

            SeedContext.ts

            SeedSummary.ts

            SeedLogger.ts

            SeedValidator.ts

            README.md

            index.ts

        generators/

            SportsSeeder.ts

            CategoriesSeeder.ts

            BrandsSeeder.ts

            AttributesSeeder.ts

            ProductsSeeder.ts

            ProductVariantsSeeder.ts

            InventorySeeder.ts

            PricingSeeder.ts

            CustomersSeeder.ts

            OrdersSeeder.ts

            SuppliersSeeder.ts

            MediaSeeder.ts
```

---

## Canonical Development Dataset

```
data/

    canonical/

        dataset.json

        sports.json

        categories.json

        brands.json

        attributes.json

        attribute-values.json

        products.json

        variants.json

        inventory.json

        pricing.json

        suppliers.json

        customers.json

        orders.json

        media.json

        README.md
```

The Canonical Development Dataset is a permanent project asset.

It is the authoritative reference catalogue for PCS Core.

It must never contain randomly generated catalogue data.

---

# Dataset Manifest

The Seed Framework must always load the Dataset Manifest before processing any canonical data.

File

```
data/canonical/dataset.json
```

Example

```json
{
  "version": "1.0.0",
  "name": "PCS Core Canonical Development Dataset",
  "description": "Reference dataset for development, testing, demonstrations and supplier validation.",
  "created": "2026-07-15",
  "maintainer": "PCS Core",
  "minimumPlatformVersion": "1.0.0"
}
```

The Dataset Manifest provides

- Dataset Version
- Dataset Name
- Description
- Creation Date
- Maintainer
- Minimum Supported Platform Version

---

# Dataset README

Create

```
data/canonical/README.md
```

The README must document

- Purpose of the Canonical Dataset
- Dataset philosophy
- Folder structure
- Naming conventions
- SKU conventions
- Versioning rules
- Update procedure
- Validation expectations
- Relationship to supplier feeds

The README becomes the developer reference for maintaining the canonical dataset.

---

# Canonical Dataset

The Canonical Dataset is the single source of truth for development.

It is consumed by

- Seed Framework
- Integration Tests
- Validation Framework
- Demonstrations
- Storefront
- Future Supplier Validation

Future supplier adapters should normalize supplier feeds into structures compatible with the Canonical Dataset.

---

# Seed Architecture

```
Dataset Manifest

↓

Canonical Dataset

↓

SeedRunner

↓

Individual Seeders

↓

Validation

↓

Summary

↓

Validation Report

↓

Database
```

---

# Seed Order

Execute in this order

1.

Sports

2.

Categories

3.

Brands

4.

Attributes

5.

Attribute Values

6.

Suppliers

7.

Products

8.

Product Variants

9.

Media

10.

Inventory

11.

Pricing

12.

Customers

13.

Orders

---

# Initial Dataset

## Sports

Minimum

8

Examples

- Tennis
- Padel
- Squash
- Pickleball
- Badminton
- Table Tennis
- Basketball
- Netball

---

## Categories

Minimum

20

Examples

- Racquets
- Shoes
- Apparel
- Bags
- Balls
- Strings
- Accessories

---

## Brands

Minimum

12

Examples

- Wilson
- HEAD
- Babolat
- Dunlop
- Tecnifibre
- Yonex
- ASICS
- Nike
- Adidas
- Prince
- ProKennex
- Luxilon

---

## Products

Minimum

100

Distributed realistically across all sports.

Use real-world product names wherever possible.

---

## Variants

Minimum

250

Examples

- Grip Sizes
- Shoe Sizes
- Colours
- Weights
- String Gauges

---

## Inventory

Every Variant receives

- Warehouse
- Quantity
- Reserved Quantity

Use realistic stock levels.

---

## Pricing

Every Variant receives

- Supplier Cost
- Markup Percentage
- Selling Price

Pricing must respect the PricingService business rules.

---

## Media

Every Product receives

- Primary Image
- Gallery Images

Placeholder images are acceptable for MVP.

Media must resolve through MediaService.

---

## Customers

Minimum

25

Include

- Different account ages
- Different order histories

---

## Orders

Minimum

50

Mixed Statuses

- Pending
- Processing
- Completed
- Cancelled

---

## Suppliers

Create demonstration suppliers only.

Examples

- Wilson SA
- HEAD South Africa
- Babolat Distributor
- Tecnifibre South Africa
- Demo Supplier

No production credentials.

---

# Canonical Data Standards

The Canonical Dataset must

- Use realistic sports terminology
- Use realistic brand names
- Use realistic product names
- Use believable pricing
- Use realistic inventory
- Follow PCS Core naming conventions
- Follow PCS Core SKU conventions

Avoid meaningless placeholder catalogue data.

---

# Validation

SeedValidator verifies

- Dataset Manifest
- Dataset Version
- Platform Version Compatibility
- Foreign Keys
- Missing Media
- Missing Pricing
- Missing Inventory
- Duplicate SKU
- Duplicate Variant
- Duplicate Supplier Product
- Missing Relationships

---

# Seed Summary

Generate

```
Seed Summary

Dataset Version

Platform Version

Build

Sports

Categories

Brands

Products

Variants

Inventory

Pricing

Customers

Orders

Suppliers

Duration

Warnings

Errors
```

---

# Validation Report

Generate

```
docs/

    validation/

        MVP-002/

            seed-validation-report.md

            reports/

                YYYY-MM-DD-HHMM.md
```

Include

- Dataset Version
- Platform Version
- Git Commit
- Build Status
- Seed Counts
- Validation Results
- Duration
- Warnings
- Errors
- PASS / FAIL

---

# Commands

Add

```
npm run seed

npm run seed:reset

npm run seed:validate

npm run validate:mvp-002
```

---

# Business Rules

The Seed Framework must reuse existing business services wherever appropriate.

Respect

- PricingService
- Inventory rules
- Supplier Framework
- Notification architecture (where applicable)

Do not duplicate business logic.

---

# Verification

Compile

```
npm run build
```

Execute

```
npm run seed
```

Validate

```
npm run seed:validate
```

Run

```
npm run validate:mvp-002
```

Expected

- Build passes
- Dataset Manifest validated
- Seed succeeds
- Validation passes
- No duplicate records
- No foreign key failures

---

# Acceptance Criteria

✔ Dataset Manifest implemented

✔ Canonical Dataset implemented

✔ Dataset README implemented

✔ Seed Framework implemented

✔ Seed Validation implemented

✔ Seed Summary generated

✔ Validation Report generated

✔ 100+ Products

✔ 250+ Variants

✔ Inventory generated

✔ Pricing generated

✔ Customers generated

✔ Orders generated

✔ Build passes

✔ Validation passes

---

# Deliverables

✔ Dataset Manifest

✔ Canonical Development Dataset

✔ Dataset Documentation

✔ Seed Framework

✔ Seed Validation

✔ Validation Report

✔ Documentation

---

# MVP-002 Implementation

Date:
2026-07-15

Execution Commands:

```
npm run seed
npm run seed:reset
npm run seed:validate
npm run validate:mvp-002
```

Framework Implemented In:

- tools/database/seed/SeedRunner.ts
- tools/database/seed/SeedContext.ts
- tools/database/seed/SeedSummary.ts
- tools/database/seed/SeedLogger.ts
- tools/database/seed/SeedValidator.ts
- tools/database/seed/index.ts
- tools/database/seed/validate-mvp-002.ts
- tools/database/generators/*
- data/canonical/*

Validation Report Output:

- docs/validation/MVP-002/seed-validation-report.md
- docs/validation/MVP-002/reports/YYYY-MM-DD-HHMM.md

Verified Outcome:

- Build passed
- Seed reset passed
- Seed validate passed
- Dataset manifest validated
- 100+ products achieved (114)
- 250+ variants achieved (342)
- Inventory generated for all variants
- Pricing generated for all variants using PricingService
- Customers generated (25)
- Orders generated (50)

---

# Completion Checklist

☑ Dataset Manifest created

☑ Dataset README created

☑ Canonical Dataset created

☑ Seed Framework implemented

☑ Dataset loaded successfully

☑ Validation implemented

☑ Summary generated

☑ Validation Report generated

☑ Build passes

☑ Seed validation passes

☐ Commit completed

---

# Commit Message

```
feat(seed): implement canonical seed data framework
```

---

# Notes

The Canonical Development Dataset is the authoritative reference dataset for PCS Core.

It represents the Pro Court Sports business domain independently of any supplier.

The Dataset Manifest defines the dataset version and compatibility.

The Seed Framework consumes the Canonical Development Dataset to generate deterministic development and testing databases.

Future supplier adapters will normalize supplier-specific data into structures compatible with the Canonical Dataset.

This architecture ensures consistency across development, testing, demonstrations, supplier onboarding and future production integrations.

Completion of MVP-002 prepares PCS Core for MVP-003 Storefront Polish using realistic, business-oriented catalogue data.

---

# End Milestone