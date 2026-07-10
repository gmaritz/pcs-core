# PCS Core Engineering Specification

Specification:
SPEC-017

Title:
Payment CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 18

Module:
Payment

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Order and Order Item modules as the primary reference implementations.

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

The implementation must compile successfully.

---

# Objective

Implement the complete Payment CRUD module.

A Payment records a financial transaction against an Order.

This specification establishes the Payment entity only.

Future specifications will introduce:

- PayFast integration
- PayGate integration
- Yoco integration
- Ozow integration
- Refunds
- Partial payments
- Webhooks
- Payment reconciliation

Do not implement these features in this specification.

---

# Reference Implementations

Use

Order

↓

Order Item

↓

Customer

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

If Payment does not already exist, create it.

Suggested MVP model

model Payment {

  id String @id @default(uuid())

  paymentReference String @unique

  amount Decimal

  currency String @default("ZAR")

  method PaymentMethod

  status PaymentStatus @default(PENDING)

  transactionReference String?

  notes String?

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  orderId String

  order Order
    @relation(fields: [orderId], references: [id])

  @@index([orderId])

  @@index([status])

  @@map("payments")

}

Create enums

enum PaymentMethod {

  EFT

  CREDIT_CARD

  DEBIT_CARD

  CASH

  PAYFAST

  PAYGATE

  YOCO

  OZOW

}

enum PaymentStatus {

  PENDING

  AUTHORIZED

  PAID

  FAILED

  CANCELLED

  REFUNDED

}

Update Order

payments Payment[]

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/payments/controllers/PaymentController.ts

src/modules/payments/routes/payment.routes.ts

src/modules/payments/types/payment.dto.ts

src/modules/payments/validation/payment.validation.ts

---

## Replace

src/modules/payments/services/PaymentService.ts

src/modules/payments/controllers/index.ts

src/modules/payments/routes/index.ts

src/modules/payments/services/index.ts

src/modules/payments/types/index.ts

src/modules/payments/validation/index.ts

src/app.ts

---

# DTO Requirements

CreatePaymentDto

Fields

orderId

amount

currency?

method

transactionReference?

notes?

---

UpdatePaymentDto

Fields

status?

transactionReference?

notes?

---

# Validation Requirements

Implement

validateCreatePayment()

Rules

orderId required

amount required

amount > 0

method required

currency required if supplied

---

Implement

validateUpdatePayment()

Rules

status must be valid

No Prisma access.

No business logic.

---

# Controller Requirements

Implement

PaymentController

Methods

getPayments()

getPayment()

createPayment()

updatePayment()

deletePayment()

Responsibilities

Receive request

↓

Validate DTO

↓

Call PaymentService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace PaymentService.

Extend BaseService.

Implement

getPayment()

getPayments()

createPayment()

updatePayment()

deletePayment()

Use

Prisma.PaymentCreateInput

Prisma.PaymentUpdateInput

Generate

paymentReference

Temporary strategy

PAY-000001

PAY-000002

or equivalent timestamp-based implementation.

Payment reference never changes.

Connect

Order

using orderId.

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

/api/v1/payments

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

Every Payment belongs to one Order.

Payment amount must be greater than zero.

Payment reference generated automatically.

Payment reference never changes.

Default currency

ZAR.

Default status

PENDING.

No payment gateway integration in this specification.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/payments

works.

GET

/api/v1/payments/:id

works.

POST

creates Payment.

PUT

updates Payment.

DELETE

removes Payment.

404 returned when Payment not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure an Order exists.

Record the Order ID.

---

# Test 1

GET

/api/v1/payments

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/payments

Body

{
    "orderId": "<order-id>",
    "amount": 6599.98,
    "currency": "ZAR",
    "method": "EFT",
    "notes": "Customer EFT payment"
}

Expected

HTTP 201

Payment created.

Payment reference generated.

Save Payment ID.

---

# Test 3

GET

/api/v1/payments/<payment-id>

Expected

HTTP 200

Correct Payment returned.

---

# Test 4

PUT

/api/v1/payments/<payment-id>

Body

{
    "status": "PAID",
    "transactionReference": "EFT-20260710-001"
}

Expected

HTTP 200

Payment updated.

---

# Test 5

GET

/api/v1/payments/<payment-id>

Verify update.

---

# Test 6

DELETE

/api/v1/payments/<payment-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/payments/<payment-id>

Expected

HTTP 404

{
    "message": "Payment not found."
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

☐ Payment reference generation verified

☐ Commit completed

---

# Commit Message

feat(payments): implement Payment CRUD

---

# End Specification