# PCS Core Engineering Specification

Specification:
SPEC-008

Title:
Inventory Movement CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 9

Module:
Inventory Movement

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Inventory module as the primary reference implementation.

Follow the existing project architecture exactly.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, formatting, comments and folder structure.

If Prisma schema changes are required:

- Update schema.prisma
- Create and apply a migration
- Regenerate the Prisma Client
- Compile the application
- Resolve all TypeScript errors

---

# Objective

Implement the Inventory Movement CRUD module.

Inventory Movement records every adjustment made to inventory.

This module forms the audit trail of stock movement.

For MVP we only require manual movement recording.

Future specifications will automatically create Inventory Movements from:

- Purchase Orders
- Sales Orders
- Returns
- Stock Takes
- Warehouse Transfers

Do not implement those integrations in this specification.

---

# Reference Implementations

Use:

Inventory

↓

Product Variant

↓

Supplier

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

If InventoryMovement does not already exist, create it.

Suggested MVP model

model InventoryMovement {

  id String @id @default(uuid())

  movementType InventoryMovementType

  quantity Int

  reason String?

  reference String?

  createdAt DateTime @default(now())

  inventoryId String

  inventory Inventory
    @relation(fields: [inventoryId], references: [id])

  @@index([inventoryId])

  @@index([movementType])

  @@map("inventory_movements")

}

Create enum

enum InventoryMovementType {

  STOCK_IN

  STOCK_OUT

  ADJUSTMENT

}

Update Inventory model

movements InventoryMovement[]

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/inventory/controllers/InventoryMovementController.ts

src/modules/inventory/routes/inventory-movement.routes.ts

src/modules/inventory/types/inventory-movement.dto.ts

src/modules/inventory/validation/inventory-movement.validation.ts

---

## Replace

src/modules/inventory/services/InventoryMovementService.ts

src/modules/inventory/controllers/index.ts

src/modules/inventory/routes/index.ts

src/modules/inventory/services/index.ts

src/modules/inventory/types/index.ts

src/modules/inventory/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateInventoryMovementDto

Fields

movementType

quantity

reason?

reference?

inventoryId

---

UpdateInventoryMovementDto

movementType?

quantity?

reason?

reference?

---

# Validation Requirements

Implement

validateCreateInventoryMovement()

Rules

movementType required

quantity required

quantity > 0

inventoryId required

---

Implement

validateUpdateInventoryMovement()

Rules

If quantity supplied

quantity > 0

Validation contains no Prisma access.

No business logic.

---

# Controller Requirements

Implement

InventoryMovementController

Methods

getInventoryMovements()

getInventoryMovement()

createInventoryMovement()

updateInventoryMovement()

deleteInventoryMovement()

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

Replace InventoryMovementService.

Extend BaseService.

Implement

getInventoryMovement()

getInventoryMovements()

createInventoryMovement()

updateInventoryMovement()

deleteInventoryMovement()

Use

Prisma.InventoryMovementCreateInput

Prisma.InventoryMovementUpdateInput

Connect InventoryMovement to Inventory using inventoryId.

No nested creates.

---

# Business Rules

Inventory Movement belongs to one Inventory record.

Movement quantity must always be positive.

Movement type determines business meaning only.

Do not automatically update Inventory quantities in this specification.

Inventory updates will be implemented in a later specification.

---

# Routes

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Maintain identical routing implementation.

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

/api/v1/inventory-movements

Maintain existing registrations.

---

# Coding Standards

Maintain existing formatting.

Maintain comments.

Maintain section headers.

Use async/await.

No console.log.

No architectural changes.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/inventory-movements

works.

GET

/api/v1/inventory-movements/:id

works.

POST

creates Inventory Movement.

PUT

updates Inventory Movement.

DELETE

removes Inventory Movement.

404 returned when Inventory Movement not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure an Inventory record exists.

Record the Inventory ID.

---

# Test 1

GET

/api/v1/inventory-movements

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/inventory-movements

Body

{
    "movementType": "STOCK_IN",
    "quantity": 20,
    "reason": "Initial Stock",
    "reference": "PO-1001",
    "inventoryId": "<inventory-id>"
}

Expected

HTTP 201

Movement created.

Save Movement ID.

---

# Test 3

GET

/api/v1/inventory-movements/<movement-id>

Expected

HTTP 200

Correct movement returned.

---

# Test 4

PUT

/api/v1/inventory-movements/<movement-id>

Body

{
    "reason": "Updated Initial Stock"
}

Expected

HTTP 200

Movement updated.

---

# Test 5

GET

/api/v1/inventory-movements/<movement-id>

Verify update.

---

# Test 6

DELETE

/api/v1/inventory-movements/<movement-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/inventory-movements/<movement-id>

Expected

HTTP 404

{
    "message": "Inventory Movement not found."
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

☐ Inventory relationship verified

☐ Commit completed

---

# Commit Message

feat(inventory): implement Inventory Movement CRUD

---

# End Specification