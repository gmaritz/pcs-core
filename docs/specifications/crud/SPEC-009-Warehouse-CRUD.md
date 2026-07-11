# PCS Core Engineering Specification

Specification:
SPEC-009

Title:
Warehouse CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 10

Module:
Warehouse

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Inventory and Inventory Movement modules as the primary reference implementations.

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

Implement the Warehouse CRUD module.

A Warehouse represents a physical stock location.

For MVP the warehouse only stores master information.

Future specifications will introduce:

- Multi-warehouse inventory
- Warehouse transfers
- Picking
- Receiving
- Bin locations
- Dispatching

Do not implement those features in this specification.

---

# Reference Implementations

Use:

Inventory

↓

Inventory Movement

↓

Supplier

Follow the same implementation pattern.

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

If Warehouse does not already exist, create it.

Suggested MVP model

model Warehouse {

  id String @id @default(uuid())

  name String

  code String @unique

  slug String @unique

  description String?

  addressLine1 String?

  addressLine2 String?

  suburb String?

  city String?

  province String?

  postalCode String?

  country String?

  contactName String?

  contactEmail String?

  contactPhone String?

  displayOrder Int @default(0)

  status RecordStatus @default(ACTIVE)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  @@index([displayOrder])

  @@map("warehouses")

}

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/inventory/controllers/WarehouseController.ts

src/modules/inventory/routes/warehouse.routes.ts

src/modules/inventory/types/warehouse.dto.ts

src/modules/inventory/validation/warehouse.validation.ts

---

## Replace

src/modules/inventory/services/WarehouseService.ts

src/modules/inventory/controllers/index.ts

src/modules/inventory/routes/index.ts

src/modules/inventory/services/index.ts

src/modules/inventory/types/index.ts

src/modules/inventory/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateWarehouseDto

Fields

name

description?

addressLine1?

addressLine2?

suburb?

city?

province?

postalCode?

country?

contactName?

contactEmail?

contactPhone?

displayOrder?

---

UpdateWarehouseDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateWarehouse()

Rules

Warehouse name required.

---

Implement

validateUpdateWarehouse()

Rules

If name supplied

must not be empty.

Validation contains no Prisma access.

No business logic.

---

# Controller Requirements

Implement

WarehouseController

Methods

getWarehouses()

getWarehouse()

createWarehouse()

updateWarehouse()

deleteWarehouse()

Responsibilities

Receive request

↓

Validate DTO

↓

Call WarehouseService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace WarehouseService.

Extend BaseService.

Implement

getWarehouse()

getWarehouses()

createWarehouse()

updateWarehouse()

deleteWarehouse()

Use

Prisma.WarehouseCreateInput

Prisma.WarehouseUpdateInput

Generate

slug

Generate

warehouse code

If warehouseCodeService does not exist, use the existing temporary three-character uppercase strategy.

Warehouse code remains unchanged after creation.

---

# Routes

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Maintain the existing routing implementation.

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

/api/v1/warehouses

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

# Business Rules

Warehouse code generated automatically.

Slug generated automatically.

Changing Warehouse name updates slug.

Warehouse code remains unchanged.

Warehouse is a master entity only.

No inventory allocation implemented in this specification.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/warehouses

works.

GET

/api/v1/warehouses/:id

works.

POST

creates Warehouse.

PUT

updates Warehouse.

DELETE

removes Warehouse.

404 returned when Warehouse not found.

Responses use ApiResponse.

---

# Verification Suite

# Test 1

GET

/api/v1/warehouses

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/warehouses

Body

{
    "name": "Cape Town Distribution Centre",
    "description": "Primary warehouse",
    "addressLine1": "1 Industrial Road",
    "city": "Cape Town",
    "province": "Western Cape",
    "postalCode": "7441",
    "country": "South Africa",
    "contactName": "Warehouse Manager",
    "contactEmail": "warehouse@example.com",
    "contactPhone": "+27 21 555 1000",
    "displayOrder": 1
}

Expected

HTTP 201

Warehouse created.

Save Warehouse ID.

---

# Test 3

GET

/api/v1/warehouses/<warehouse-id>

Expected

HTTP 200

Correct Warehouse returned.

---

# Test 4

PUT

/api/v1/warehouses/<warehouse-id>

Body

{
    "description": "Updated warehouse description",
    "displayOrder": 2
}

Expected

HTTP 200

Warehouse updated.

---

# Test 5

GET

/api/v1/warehouses/<warehouse-id>

Verify update.

---

# Test 6

DELETE

/api/v1/warehouses/<warehouse-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/warehouses/<warehouse-id>

Expected

HTTP 404

{
    "message": "Warehouse not found."
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

☐ Commit completed

---

# Commit Message

feat(inventory): implement Warehouse CRUD

---

# End Specification