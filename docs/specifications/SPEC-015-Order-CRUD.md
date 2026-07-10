# PCS Core Engineering Specification

Specification:
SPEC-015

Title:
Order CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 16

Module:
Order

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Customer, Address, Cart and Cart Item modules as the primary reference implementations.

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

Implement the complete Order CRUD module.

The Order represents a completed customer purchase.

This specification only creates the Order master record.

Order Items will be implemented in SPEC-016.

Future specifications will introduce:

- Checkout workflow
- Order numbering
- Order status workflow
- Shipping
- Tax
- Discounts
- Payment integration
- Email notifications

Do not implement these features in this specification.

---

# Reference Implementations

Use

Customer

↓

Address

↓

Cart

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

If Order does not already exist, create it.

Suggested MVP model

model Order {

  id String @id @default(uuid())

  orderNumber String @unique

  status OrderStatus @default(PENDING)

  notes String?

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  customerId String

  customer Customer
    @relation(fields: [customerId], references: [id])

  billingAddressId String?

  billingAddress Address?
    @relation("BillingAddress", fields: [billingAddressId], references: [id])

  shippingAddressId String?

  shippingAddress Address?
    @relation("ShippingAddress", fields: [shippingAddressId], references: [id])

  items OrderItem[]

  @@index([customerId])

  @@map("orders")

}

Create enum

enum OrderStatus {

  PENDING

  CONFIRMED

  PROCESSING

  SHIPPED

  COMPLETED

  CANCELLED

}

Update Customer

orders Order[]

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/orders/controllers/OrderController.ts

src/modules/orders/routes/order.routes.ts

src/modules/orders/types/order.dto.ts

src/modules/orders/validation/order.validation.ts

---

## Replace

src/modules/orders/services/OrderService.ts

src/modules/orders/controllers/index.ts

src/modules/orders/routes/index.ts

src/modules/orders/services/index.ts

src/modules/orders/types/index.ts

src/modules/orders/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateOrderDto

Fields

customerId

billingAddressId?

shippingAddressId?

notes?

---

UpdateOrderDto

Fields

status?

billingAddressId?

shippingAddressId?

notes?

---

# Validation Requirements

Implement

validateCreateOrder()

Rules

customerId required

---

Implement

validateUpdateOrder()

Rules

status must be a valid OrderStatus if supplied

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

OrderController

Methods

getOrders()

getOrder()

createOrder()

updateOrder()

deleteOrder()

Responsibilities

Receive request

↓

Validate DTO

↓

Call OrderService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace OrderService.

Extend BaseService.

Implement

getOrder()

getOrders()

createOrder()

updateOrder()

deleteOrder()

Use

Prisma.OrderCreateInput

Prisma.OrderUpdateInput

Generate

orderNumber

Temporary strategy

ORD-000001

ORD-000002

etc.

A simple sequential or timestamp-based implementation is acceptable for MVP.

Connect

Customer

using customerId

Connect

Billing Address if supplied

Connect

Shipping Address if supplied

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

/api/v1/orders

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

Every Order belongs to one Customer.

Billing Address optional.

Shipping Address optional.

Order Number generated automatically.

Order Number never changes.

Order Items are NOT implemented in this specification.

Default status

PENDING.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/orders

works.

GET

/api/v1/orders/:id

works.

POST

creates Order.

PUT

updates Order.

DELETE

removes Order.

404 returned when Order not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure the following records exist.

Customer

Optional

Billing Address

Optional

Shipping Address

Record all IDs.

---

# Test 1

GET

/api/v1/orders

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/orders

Body

{
    "customerId": "<customer-id>",
    "billingAddressId": "<billing-address-id>",
    "shippingAddressId": "<shipping-address-id>",
    "notes": "Customer requested morning delivery."
}

Expected

HTTP 201

Order created.

Order Number generated.

Save Order ID.

---

# Test 3

GET

/api/v1/orders/<order-id>

Expected

HTTP 200

Correct Order returned.

---

# Test 4

PUT

/api/v1/orders/<order-id>

Body

{
    "status": "CONFIRMED",
    "notes": "Payment received."
}

Expected

HTTP 200

Order updated.

---

# Test 5

GET

/api/v1/orders/<order-id>

Verify update.

---

# Test 6

DELETE

/api/v1/orders/<order-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/orders/<order-id>

Expected

HTTP 404

{
    "message": "Order not found."
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

☐ Address relationships verified

☐ Order number generation verified

☐ Commit completed

---

# Commit Message

feat(orders): implement Order CRUD

---

# End Specification