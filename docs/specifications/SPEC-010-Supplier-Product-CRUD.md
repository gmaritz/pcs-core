# PCS Core Engineering Specification

Specification:
SPEC-010

Title:
Supplier Product CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 11

Module:
Supplier Product

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Product, Product Variant, Supplier and Inventory modules as the reference implementations.

Follow the existing architecture exactly.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, comments, formatting and folder structure.

If Prisma schema changes are required:

- Update schema.prisma
- Create and apply a migration
- Regenerate Prisma Client
- Compile the project
- Resolve all compile errors

---

# Objective

Implement the Supplier Product CRUD module.

Supplier Product represents the relationship between a supplier and a Product Variant.

This module forms the foundation for supplier catalogue imports.

Only implement CRUD.

Future specifications will extend this module with:

- Supplier pricing
- Lead times
- Supplier stock
- Supplier API synchronization
- Supplier product import
- Purchase Orders

Do not implement those features in this specification.

---

# Reference Implementations

Use

Supplier

↓

Product Variant

↓

Inventory

Maintain identical architecture.

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

Architecture must remain unchanged.

---

# Prisma Requirements

If SupplierProduct does not already exist, create it.

Suggested MVP model

model SupplierProduct {

  id String @id @default(uuid())

  supplierSku String

  supplierProductName String?

  supplierPrice Decimal?

  currency String? @default("ZAR")

  active Boolean @default(true)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  supplierId String

  supplier Supplier
    @relation(fields: [supplierId], references: [id])

  productVariantId String

  productVariant ProductVariant
    @relation(fields: [productVariantId], references: [id])

  @@unique([supplierId, productVariantId])

  @@index([supplierId])

  @@index([productVariantId])

  @@map("supplier_products")

}

Update

Supplier

supplierProducts SupplierProduct[]

Update

ProductVariant

supplierProducts SupplierProduct[]

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/suppliers/controllers/SupplierProductController.ts

src/modules/suppliers/routes/supplier-product.routes.ts

src/modules/suppliers/types/supplier-product.dto.ts

src/modules/suppliers/validation/supplier-product.validation.ts

---

## Replace

src/modules/suppliers/services/SupplierProductService.ts

src/modules/suppliers/controllers/index.ts

src/modules/suppliers/routes/index.ts

src/modules/suppliers/services/index.ts

src/modules/suppliers/types/index.ts

src/modules/suppliers/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateSupplierProductDto

Fields

supplierSku

supplierProductName?

supplierPrice?

currency?

active?

supplierId

productVariantId

---

UpdateSupplierProductDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateSupplierProduct()

Rules

supplierSku required

supplierId required

productVariantId required

supplierPrice must be zero or greater if supplied

---

Implement

validateUpdateSupplierProduct()

Rules

supplierPrice must be zero or greater if supplied

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

SupplierProductController

Methods

getSupplierProducts()

getSupplierProduct()

createSupplierProduct()

updateSupplierProduct()

deleteSupplierProduct()

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

Replace SupplierProductService.

Extend BaseService.

Implement

getSupplierProduct()

getSupplierProducts()

createSupplierProduct()

updateSupplierProduct()

deleteSupplierProduct()

Use

Prisma.SupplierProductCreateInput

Prisma.SupplierProductUpdateInput

Connect

Supplier

using supplierId

Connect

Product Variant

using productVariantId

No nested creates.

---

# Routes

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Maintain existing routing implementation.

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

/api/v1/supplier-products

Maintain all existing registrations.

---

# Coding Standards

Maintain existing formatting.

Maintain comments.

Maintain section headers.

Use async/await.

No console.log.

No architectural changes.

---

# Business Rules

One Supplier may supply many Product Variants.

One Product Variant may be supplied by many Suppliers.

Only one relationship per Supplier/Product Variant pair.

Supplier SKU is mandatory.

Supplier Product Name is optional.

Supplier Price is optional for MVP.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/supplier-products

works.

GET

/api/v1/supplier-products/:id

works.

POST

creates Supplier Product.

PUT

updates Supplier Product.

DELETE

removes Supplier Product.

404 returned when Supplier Product not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure the following records exist.

Supplier

↓

Product Variant

Record both IDs.

---

# Test 1

GET

/api/v1/supplier-products

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/supplier-products

Body

{
    "supplierSku": "WIL-RF97-438",
    "supplierProductName": "Wilson Pro Staff RF97 4 3/8",
    "supplierPrice": 3299.99,
    "currency": "ZAR",
    "active": true,
    "supplierId": "<supplier-id>",
    "productVariantId": "<product-variant-id>"
}

Expected

HTTP 201

Supplier Product created.

Save Supplier Product ID.

---

# Test 3

GET

/api/v1/supplier-products/<supplier-product-id>

Expected

HTTP 200

Correct Supplier Product returned.

---

# Test 4

PUT

/api/v1/supplier-products/<supplier-product-id>

Body

{
    "supplierPrice": 3199.99,
    "active": false
}

Expected

HTTP 200

Supplier Product updated.

---

# Test 5

GET

/api/v1/supplier-products/<supplier-product-id>

Verify update.

---

# Test 6

DELETE

/api/v1/supplier-products/<supplier-product-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/supplier-products/<supplier-product-id>

Expected

HTTP 404

{
    "message": "Supplier Product not found."
}

---

# Completion Checklist

☐ Migration created

☐ Prisma Client generated

☐ Application compiles

☐ No TypeScript errors

☐ GET All passed

☐ GET By ID passed

☐ POST passed

☐ PUT passed

☐ DELETE passed

☐ Supplier relationship verified

☐ Product Variant relationship verified

☐ Commit completed

---

# Commit Message

feat(suppliers): implement Supplier Product CRUD

---

# End Specification