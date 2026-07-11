# PCS Core Engineering Specification

Specification:
SPEC-014

Title:
Cart Item CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 15

Module:
Cart Item

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Cart and Product Variant modules as the primary reference implementations.

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

Implement the complete Cart Item CRUD module.

A Cart Item represents a Product Variant contained within a Cart.

This specification establishes the relationship between Cart and Product Variant.

Future specifications will introduce:

- Automatic quantity merging
- Price snapshots
- Promotions
- Discounts
- Tax calculations
- Shipping calculations

Do not implement these features in this specification.

---

# Reference Implementations

Use

Cart

↓

Product Variant

↓

Inventory

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

If CartItem does not already exist, create it.

Suggested MVP model

model CartItem {

  id String @id @default(uuid())

  quantity Int

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  cartId String

  cart Cart
    @relation(fields: [cartId], references: [id])

  productVariantId String

  productVariant ProductVariant
    @relation(fields: [productVariantId], references: [id])

  @@unique([cartId, productVariantId])

  @@index([cartId])

  @@index([productVariantId])

  @@map("cart_items")

}

Update Cart

items CartItem[]

Update ProductVariant

cartItems CartItem[]

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/commerce/controllers/CartItemController.ts

src/modules/commerce/routes/cart-item.routes.ts

src/modules/commerce/types/cart-item.dto.ts

src/modules/commerce/validation/cart-item.validation.ts

---

## Replace

src/modules/commerce/services/CartItemService.ts

src/modules/commerce/controllers/index.ts

src/modules/commerce/routes/index.ts

src/modules/commerce/services/index.ts

src/modules/commerce/types/index.ts

src/modules/commerce/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateCartItemDto

Fields

cartId

productVariantId

quantity

---

UpdateCartItemDto

Fields

quantity?

---

# Validation Requirements

Implement

validateCreateCartItem()

Rules

cartId required

productVariantId required

quantity required

quantity > 0

---

Implement

validateUpdateCartItem()

Rules

If quantity supplied

quantity > 0

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

CartItemController

Methods

getCartItems()

getCartItem()

createCartItem()

updateCartItem()

deleteCartItem()

Responsibilities

Receive request

↓

Validate DTO

↓

Call CartItemService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace CartItemService.

Extend BaseService.

Implement

getCartItem()

getCartItems()

createCartItem()

updateCartItem()

deleteCartItem()

Use

Prisma.CartItemCreateInput

Prisma.CartItemUpdateInput

Connect

Cart

using cartId

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

/api/v1/cart-items

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

Each Cart Item belongs to one Cart.

Each Cart Item references one Product Variant.

Quantity must always be greater than zero.

Duplicate Cart/Product Variant combinations are prevented by the unique constraint.

Inventory is NOT checked in this specification.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/cart-items

works.

GET

/api/v1/cart-items/:id

works.

POST

creates Cart Item.

PUT

updates Cart Item.

DELETE

removes Cart Item.

404 returned when Cart Item not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure the following records exist.

Customer

↓

Cart

↓

Product Variant

Record

Cart ID

Product Variant ID

---

# Test 1

GET

/api/v1/cart-items

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/cart-items

Body

{
    "cartId": "<cart-id>",
    "productVariantId": "<product-variant-id>",
    "quantity": 2
}

Expected

HTTP 201

Cart Item created.

Save Cart Item ID.

---

# Test 3

GET

/api/v1/cart-items/<cart-item-id>

Expected

HTTP 200

Correct Cart Item returned.

---

# Test 4

PUT

/api/v1/cart-items/<cart-item-id>

Body

{
    "quantity": 3
}

Expected

HTTP 200

Cart Item updated.

---

# Test 5

GET

/api/v1/cart-items/<cart-item-id>

Verify update.

---

# Test 6

DELETE

/api/v1/cart-items/<cart-item-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/cart-items/<cart-item-id>

Expected

HTTP 404

{
    "message": "Cart Item not found."
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

☐ Cart relationship verified

☐ Product Variant relationship verified

☐ Commit completed

---

# Commit Message

feat(commerce): implement Cart Item CRUD

---

# End Specification