# PCS Core Engineering Specification

Specification:
SPEC-013

Title:
Cart CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 14

Module:
Cart

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Customer and Address modules as the primary reference implementations.

Follow the existing architecture exactly.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, formatting, comments and folder structure.

If Prisma schema changes are required:

- Update schema.prisma
- Create and apply a migration
- Regenerate the Prisma Client
- Compile the application
- Resolve all TypeScript errors before completion.

---

# Objective

Implement the complete Cart CRUD module.

A Cart represents a shopping cart belonging to a Customer.

This specification only implements the Cart master record.

Cart Items will be implemented in SPEC-014.

Future specifications will introduce:

- Anonymous carts
- Cart expiration
- Saved carts
- Promotions
- Discount codes
- Tax calculation

Do not implement these features in this specification.

---

# Reference Implementations

Use

Customer

↓

Address

↓

Supplier

Maintain the existing architecture exactly.

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

If Cart does not already exist, create it.

Suggested MVP model

model Cart {

  id String @id @default(uuid())

  status CartStatus @default(ACTIVE)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  customerId String

  customer Customer
    @relation(fields: [customerId], references: [id])

  items CartItem[]

  @@unique([customerId])

  @@index([customerId])

  @@map("carts")

}

Create enum

enum CartStatus {

  ACTIVE

  CHECKED_OUT

  ABANDONED

}

Update Customer

cart Cart?

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/commerce/controllers/CartController.ts

src/modules/commerce/routes/cart.routes.ts

src/modules/commerce/types/cart.dto.ts

src/modules/commerce/validation/cart.validation.ts

---

## Replace

src/modules/commerce/services/CartService.ts

src/modules/commerce/controllers/index.ts

src/modules/commerce/routes/index.ts

src/modules/commerce/services/index.ts

src/modules/commerce/types/index.ts

src/modules/commerce/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateCartDto

Fields

customerId

---

UpdateCartDto

Fields

status?

---

# Validation Requirements

Implement

validateCreateCart()

Rules

customerId required

---

Implement

validateUpdateCart()

Rules

status must be a valid CartStatus if supplied

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

CartController

Methods

getCarts()

getCart()

createCart()

updateCart()

deleteCart()

Responsibilities

Receive request

↓

Validate DTO

↓

Call CartService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace CartService.

Extend BaseService.

Implement

getCart()

getCarts()

createCart()

updateCart()

deleteCart()

Use

Prisma.CartCreateInput

Prisma.CartUpdateInput

Connect Cart to Customer using customerId.

No nested creates.

---

# Routes

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Follow the same routing implementation used throughout the project.

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

/api/v1/carts

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

Each Customer may have only one active Cart.

Cart always belongs to one Customer.

Cart Items are not implemented in this specification.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/carts

works.

GET

/api/v1/carts/:id

works.

POST

creates Cart.

PUT

updates Cart.

DELETE

removes Cart.

404 returned when Cart not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure at least one Customer exists.

Record Customer ID.

---

# Test 1

GET

/api/v1/carts

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/carts

Body

{
    "customerId": "<customer-id>"
}

Expected

HTTP 201

Cart created.

Save Cart ID.

---

# Test 3

GET

/api/v1/carts/<cart-id>

Expected

HTTP 200

Correct Cart returned.

---

# Test 4

PUT

/api/v1/carts/<cart-id>

Body

{
    "status": "CHECKED_OUT"
}

Expected

HTTP 200

Cart updated.

---

# Test 5

GET

/api/v1/carts/<cart-id>

Verify update.

---

# Test 6

DELETE

/api/v1/carts/<cart-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/carts/<cart-id>

Expected

HTTP 404

{
    "message": "Cart not found."
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

☐ Customer relationship verified

☐ Commit completed

---

# Commit Message

feat(commerce): implement Cart CRUD

---

# End Specification