# PCS Core Engineering Specification

Specification:
SPEC-016

Title:
Order Item CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 17

Module:
Order Item

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Order, Product Variant and Cart Item modules as the primary reference implementations.

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

The generated implementation must compile successfully.

---

# Objective

Implement the complete Order Item CRUD module.

An Order Item represents a Product Variant purchased within an Order.

This specification establishes the relationship between Orders and Product Variants.

Future specifications will introduce:

- Price snapshots
- Discounts
- Tax
- Shipment allocation
- Returns
- Refunds

Do not implement these features in this specification.

---

# Reference Implementations

Use

Order

↓

Cart Item

↓

Product Variant

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

If OrderItem does not already exist, create it.

Suggested MVP model

model OrderItem {

  id String @id @default(uuid())

  quantity Int

  unitPrice Decimal?

  totalPrice Decimal?

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  orderId String

  order Order
    @relation(fields: [orderId], references: [id])

  productVariantId String

  productVariant ProductVariant
    @relation(fields: [productVariantId], references: [id])

  @@index([orderId])

  @@index([productVariantId])

  @@map("order_items")

}

Update Order

items OrderItem[]

Update ProductVariant

orderItems OrderItem[]

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/orders/controllers/OrderItemController.ts

src/modules/orders/routes/order-item.routes.ts

src/modules/orders/types/order-item.dto.ts

src/modules/orders/validation/order-item.validation.ts

---

## Replace

src/modules/orders/services/OrderItemService.ts

src/modules/orders/controllers/index.ts

src/modules/orders/routes/index.ts

src/modules/orders/services/index.ts

src/modules/orders/types/index.ts

src/modules/orders/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateOrderItemDto

Fields

orderId

productVariantId

quantity

unitPrice?

totalPrice?

---

UpdateOrderItemDto

Fields

quantity?

unitPrice?

totalPrice?

---

# Validation Requirements

Implement

validateCreateOrderItem()

Rules

orderId required

productVariantId required

quantity required

quantity > 0

unitPrice >= 0 if supplied

totalPrice >= 0 if supplied

---

Implement

validateUpdateOrderItem()

Rules

quantity > 0 if supplied

unitPrice >= 0 if supplied

totalPrice >= 0 if supplied

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

OrderItemController

Methods

getOrderItems()

getOrderItem()

createOrderItem()

updateOrderItem()

deleteOrderItem()

Responsibilities

Receive request

↓

Validate DTO

↓

Call OrderItemService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace OrderItemService.

Extend BaseService.

Implement

getOrderItem()

getOrderItems()

createOrderItem()

updateOrderItem()

deleteOrderItem()

Use

Prisma.OrderItemCreateInput

Prisma.OrderItemUpdateInput

Connect

Order

using orderId

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

Maintain the existing routing implementation.

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

/api/v1/order-items

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

Each Order Item belongs to one Order.

Each Order Item references one Product Variant.

Quantity must always be greater than zero.

Unit Price and Total Price are optional in MVP.

Automatic calculation of Total Price is NOT implemented in this specification.

Inventory reduction is NOT implemented in this specification.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/order-items

works.

GET

/api/v1/order-items/:id

works.

POST

creates Order Item.

PUT

updates Order Item.

DELETE

removes Order Item.

404 returned when Order Item not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure the following records exist.

Customer

↓

Order

↓

Product Variant

Record

Order ID

Product Variant ID

---

# Test 1

GET

/api/v1/order-items

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/order-items

Body

{
    "orderId": "<order-id>",
    "productVariantId": "<product-variant-id>",
    "quantity": 2,
    "unitPrice": 3299.99,
    "totalPrice": 6599.98
}

Expected

HTTP 201

Order Item created.

Save Order Item ID.

---

# Test 3

GET

/api/v1/order-items/<order-item-id>

Expected

HTTP 200

Correct Order Item returned.

---

# Test 4

PUT

/api/v1/order-items/<order-item-id>

Body

{
    "quantity": 3,
    "totalPrice": 9899.97
}

Expected

HTTP 200

Order Item updated.

---

# Test 5

GET

/api/v1/order-items/<order-item-id>

Verify update.

---

# Test 6

DELETE

/api/v1/order-items/<order-item-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/order-items/<order-item-id>

Expected

HTTP 404

{
    "message": "Order Item not found."
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

☐ Order relationship verified

☐ Product Variant relationship verified

☐ Commit completed

---

# Commit Message

feat(orders): implement Order Item CRUD

---

# End Specification