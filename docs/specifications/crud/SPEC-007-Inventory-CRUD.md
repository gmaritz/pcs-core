# PCS Core Engineering Specification

Specification:
SPEC-007

Title:
Inventory CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 8

Module:
Inventory

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating code.

Use the completed Product Variant and Supplier modules as the canonical implementations.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, spacing, comments and folder structure.

If Prisma schema changes are required:

- Update schema.prisma
- Create and apply a migration
- Regenerate the Prisma Client
- Compile the project
- Resolve all compile errors before completion

---

# Objective

Implement the Inventory CRUD module.

Inventory represents the stock level for a Product Variant.

For MVP, inventory is maintained as a single quantity per Product Variant.

Future specifications will introduce:

- Warehouses
- Inventory Movements
- Reservations
- Transfers
- Purchase Orders
- Stock Takes

Do not implement those features in this specification.

---

# Reference Implementations

Use:

1. Product Variant
2. Supplier
3. Product

Follow the existing architecture exactly.

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

This architecture must not change.

---

# Prisma Requirements

If Inventory does not already exist, create it.

Suggested MVP model

model Inventory {

  id String @id @default(uuid())

  quantityOnHand Int @default(0)

  reorderLevel Int @default(0)

  status RecordStatus @default(ACTIVE)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  productVariantId String @unique

  productVariant ProductVariant
    @relation(fields: [productVariantId], references: [id])

  @@map("inventory")

}

Create and apply migration.

Regenerate Prisma Client.

---

# Files

## Create

src/modules/inventory/controllers/InventoryController.ts

src/modules/inventory/routes/inventory.routes.ts

src/modules/inventory/types/inventory.dto.ts

src/modules/inventory/validation/inventory.validation.ts

---

## Replace

src/modules/inventory/services/InventoryService.ts

src/modules/inventory/controllers/index.ts

src/modules/inventory/routes/index.ts

src/modules/inventory/services/index.ts

src/modules/inventory/types/index.ts

src/modules/inventory/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateInventoryDto

Fields

quantityOnHand

reorderLevel

productVariantId

---

UpdateInventoryDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateInventory()

Rules

quantityOnHand required

quantityOnHand >= 0

reorderLevel >= 0

productVariantId required

---

Implement

validateUpdateInventory()

If supplied

quantityOnHand >= 0

reorderLevel >= 0

Validation must not access Prisma.

---

# Controller Requirements

Implement

InventoryController

Methods

getInventories()

getInventory()

createInventory()

updateInventory()

deleteInventory()

Responsibilities

Receive request

↓

Validate DTO

↓

Call InventoryService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace InventoryService.

Extend BaseService.

Implement

getInventory()

getInventories()

createInventory()

updateInventory()

deleteInventory()

Use

Prisma.InventoryCreateInput

Prisma.InventoryUpdateInput

Connect Inventory to Product Variant using productVariantId.

No nested creates.

---

# Routes

Create

inventory.routes.ts

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Use the same routing implementation as previous modules.

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

/api/v1/inventory

Maintain existing route registrations.

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

One Inventory record per Product Variant.

Inventory cannot exist without a Product Variant.

Negative quantities are not allowed.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/inventory

works.

GET

/api/v1/inventory/:id

works.

POST

creates Inventory.

PUT

updates Inventory.

DELETE

removes Inventory.

404 returned when Inventory not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure at least one Product Variant exists.

Record the Product Variant ID.

---

# Test 1

GET

/api/v1/inventory

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/inventory

Body

{
  "quantityOnHand": 25,
  "reorderLevel": 5,
  "productVariantId": "<product-variant-id>"
}

Expected

HTTP 201

Inventory created.

Save Inventory ID.

---

# Test 3

GET

/api/v1/inventory/<inventory-id>

Expected

HTTP 200

Correct Inventory returned.

---

# Test 4

PUT

/api/v1/inventory/<inventory-id>

Body

{
  "quantityOnHand": 18,
  "reorderLevel": 4
}

Expected

HTTP 200

Updated Inventory returned.

---

# Test 5

GET

/api/v1/inventory/<inventory-id>

Verify update.

---

# Test 6

DELETE

/api/v1/inventory/<inventory-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/inventory/<inventory-id>

Expected

HTTP 404

{
  "message": "Inventory not found."
}

---

# Completion Checklist

☐ Migration created

☐ Prisma Client generated

☐ Project compiles

☐ No TypeScript errors

☐ GET All passed

☐ GET By ID passed

☐ POST passed

☐ PUT passed

☐ DELETE passed

☐ Product Variant relationship verified

☐ Commit completed

---

# Commit Message

feat(inventory): implement Inventory CRUD

---

# End Specification