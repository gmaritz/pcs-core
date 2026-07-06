# PCS Core Engineering Specification

Specification:
SPEC-006

Title:
Supplier CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 7

Module:
Supplier

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this entire specification before generating any code.

Use the completed Brand, Sport, Category, Product and Product Variant modules as the canonical implementation.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, spacing, comments and folder structure.

If Prisma schema changes are required:

- Update schema.prisma
- Create a migration
- Regenerate the Prisma Client
- Compile the project
- Resolve all compile errors

---

# Objective

Implement the complete Supplier CRUD module.

A Supplier represents an external supplier or distributor that provides products to PCS Core.

This module establishes the foundation for future supplier feed imports and inventory synchronization.

Do NOT implement supplier feeds, inventory, pricing, or imports in this specification.

---

# Reference Implementations

Use the following modules as references:

1. Product
2. Category
3. Brand

Follow the same architecture and coding standards.

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

Do not modify the architecture.

---

# Prisma Requirements

If Supplier does not already exist, create it.

Suggested MVP model

model Supplier {

  id String @id @default(uuid())

  name String

  code String @unique

  slug String @unique

  description String?

  website String?

  email String?

  telephone String?

  displayOrder Int @default(0)

  status RecordStatus @default(ACTIVE)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  @@index([displayOrder])

  @@map("suppliers")

}

Create and apply a migration.

Regenerate Prisma Client.

---

# Files

## Create

src/modules/suppliers/controllers/SupplierController.ts

src/modules/suppliers/routes/supplier.routes.ts

src/modules/suppliers/types/supplier.dto.ts

src/modules/suppliers/validation/supplier.validation.ts

---

## Replace

src/modules/suppliers/services/SupplierService.ts

src/modules/suppliers/controllers/index.ts

src/modules/suppliers/routes/index.ts

src/modules/suppliers/services/index.ts

src/modules/suppliers/types/index.ts

src/modules/suppliers/validation/index.ts

src/app.ts

---

# DTO Requirements

Create

CreateSupplierDto

Fields

name

description?

website?

email?

telephone?

displayOrder?

---

Create

UpdateSupplierDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateSupplier()

Rules

Supplier name required.

---

Implement

validateUpdateSupplier()

Rules

If name supplied

must not be empty.

Validation contains no Prisma access.

Validation contains no business logic.

---

# Controller Requirements

Implement

SupplierController

Methods

getSuppliers()

getSupplier()

createSupplier()

updateSupplier()

deleteSupplier()

Responsibilities

Receive request

↓

Validate DTO

↓

Call SupplierService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace SupplierService.

Extend BaseService.

Implement

getSupplier()

getSuppliers()

createSupplier()

updateSupplier()

deleteSupplier()

Use

Prisma.SupplierCreateInput

Prisma.SupplierUpdateInput

Generate

slug

Generate

supplier code

If supplierCodeService does not exist, use the temporary three-character uppercase strategy used previously.

Supplier code remains unchanged after creation.

---

# Routes

Create

supplier.routes.ts

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Use the same routing implementation as Product.

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

/api/v1/suppliers

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

Supplier code generated automatically.

Slug generated automatically.

Changing Supplier name updates slug.

Supplier code never changes.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/suppliers

works.

GET

/api/v1/suppliers/:id

works.

POST

creates Supplier.

PUT

updates Supplier.

DELETE

removes Supplier.

404 returned when Supplier not found.

Responses use ApiResponse.

---

# Verification Suite

# Test 1

GET

/api/v1/suppliers

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/suppliers

Body

{
    "name": "Wilson South Africa",
    "description": "Official Wilson distributor",
    "website": "https://www.wilson.com",
    "email": "sales@example.com",
    "telephone": "+27 21 555 1234",
    "displayOrder": 1
}

Expected

HTTP 201

Supplier created.

Save Supplier ID.

---

# Test 3

GET

/api/v1/suppliers/<supplier-id>

Expected

HTTP 200

Correct Supplier returned.

---

# Test 4

PUT

/api/v1/suppliers/<supplier-id>

Body

{
    "description": "Updated distributor description",
    "displayOrder": 2
}

Expected

HTTP 200

Updated Supplier returned.

---

# Test 5

GET

/api/v1/suppliers/<supplier-id>

Verify update.

---

# Test 6

DELETE

/api/v1/suppliers/<supplier-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/suppliers/<supplier-id>

Expected

HTTP 404

{
    "message": "Supplier not found."
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

feat(suppliers): implement Supplier CRUD

---

# End Specification