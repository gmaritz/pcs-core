# PCS Core Engineering Specification

Specification:
SPEC-005

Title:
Product Variant CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 6

Module:
Product Variant

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this entire specification before generating any code.

Use the completed Brand, Sport, Category and Product modules as the canonical implementations.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, spacing, comments and folder structure.

Implement production-ready code.

If a Prisma schema change is required:

- Update schema.prisma
- Create a migration
- Regenerate the Prisma Client
- Compile the project
- Resolve any compile errors before completion

---

# Objective

Implement the complete Product Variant CRUD module.

This module represents a sellable variation of a Product.

For MVP, Product Variant is intentionally simple.

Future specifications will extend Product Variant with:

- Inventory
- Pricing
- Supplier SKU
- Barcode
- Weight
- Dimensions
- Images
- Attribute Values
- Warehouse Inventory

Do not implement these yet.

---

# Reference Implementations

Category

↓

Product

↓

Sport

↓

Brand

Use these modules as the implementation standard.

---

# Existing Architecture

HTTP

↓

Routes

↓

Controller

↓

Validation

↓

Service

↓

Prisma

↓

Database

Architecture must not change.

---

# Prisma Requirements

If ProductVariant does not already exist, create it.

Suggested MVP model

model ProductVariant {

  id String @id @default(uuid())

  name String

  sku String @unique

  slug String @unique

  description String?

  displayOrder Int @default(0)

  status RecordStatus @default(ACTIVE)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  productId String

  product Product @relation(fields: [productId], references: [id])

  @@index([productId])

  @@index([displayOrder])

  @@map("product_variants")

}

Update Product with

variants ProductVariant[]

Create and apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/catalog/controllers/ProductVariantController.ts

src/modules/catalog/routes/product-variant.routes.ts

src/modules/catalog/types/product-variant.dto.ts

src/modules/catalog/validation/product-variant.validation.ts

---

## Replace

src/modules/catalog/services/ProductVariantService.ts

src/modules/catalog/controllers/index.ts

src/modules/catalog/routes/index.ts

src/modules/catalog/services/index.ts

src/modules/catalog/types/index.ts

src/modules/catalog/validation/index.ts

src/app.ts

---

# DTO Requirements

Create

CreateProductVariantDto

Fields

name

description?

displayOrder?

productId

---

Create

UpdateProductVariantDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateProductVariant()

Rules

Variant name required.

---

Implement

validateUpdateProductVariant()

Rules

If name supplied

must not be empty.

Validation must contain no Prisma access.

Validation contains no business logic.

---

# Controller Requirements

Implement

ProductVariantController

Methods

getProductVariants()

getProductVariant()

createProductVariant()

updateProductVariant()

deleteProductVariant()

Responsibilities

Receive request

↓

Validate DTO

↓

Call Service

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace ProductVariantService.

Extend BaseService.

Implement

getProductVariant()

getProductVariants()

createProductVariant()

updateProductVariant()

deleteProductVariant()

Use

Prisma.ProductVariantCreateInput

Prisma.ProductVariantUpdateInput

Generate

slug

Generate

SKU

Temporary SKU strategy

Use the first three letters of the variant name

Uppercase

Until a dedicated SKU service is implemented.

Example

Wilson Pro Staff 97

↓

WIL

or equivalent consistent temporary implementation.

Connect

Product

using productId.

No nested creates.

---

# Routes

Create

product-variant.routes.ts

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Follow the same routing implementation used throughout Catalog.

Every route

try

catch

next(error)

---

# Registration

Update

controllers/index.ts

services/index.ts

types/index.ts

validation/index.ts

routes/index.ts

app.ts

Register

/api/v1/product-variants

Maintain existing registrations.

---

# Coding Standards

Follow existing project standards.

Maintain section headers.

Maintain formatting.

Maintain comments.

Use async/await.

No console.log.

No architectural changes.

---

# Business Rules

Variant belongs to one Product.

SKU generated automatically.

Slug generated automatically.

Updating the name

↓

Updates slug.

SKU remains unchanged after creation.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/product-variants

works.

GET

/api/v1/product-variants/:id

works.

POST

creates Product Variant.

PUT

updates Product Variant.

DELETE

removes Product Variant.

404 returned when Product Variant not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Create

Sport

↓

Brand

↓

Category

↓

Product

Record Product ID.

---

# Test 1

GET

/api/v1/product-variants

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/product-variants

Body

{
    "name": "Wilson Pro Staff RF97 4 3/8",
    "description": "Grip Size 3",
    "displayOrder": 1,
    "productId": "<product-id>"
}

Expected

HTTP 201

Variant created.

Save Variant ID.

---

# Test 3

GET

/api/v1/product-variants/<variant-id>

Expected

HTTP 200

Correct Variant returned.

---

# Test 4

PUT

/api/v1/product-variants/<variant-id>

Body

{
    "description": "Updated Grip Size",
    "displayOrder": 2
}

Expected

HTTP 200

Updated Variant returned.

---

# Test 5

GET

/api/v1/product-variants/<variant-id>

Verify update.

---

# Test 6

DELETE

/api/v1/product-variants/<variant-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/product-variants/<variant-id>

Expected

HTTP 404

{
    "message": "Product Variant not found."
}

---

# Completion Checklist

☐ Prisma migration created

☐ Prisma Client generated

☐ Application compiles

☐ No TypeScript errors

☐ GET All passed

☐ GET By ID passed

☐ POST passed

☐ PUT passed

☐ DELETE passed

☐ Product relationship verified

☐ Commit completed

---

# Commit Message

feat(catalog): implement Product Variant CRUD

---

# End Specification