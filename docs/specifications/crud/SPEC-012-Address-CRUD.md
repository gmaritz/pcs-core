# PCS Core Engineering Specification

Specification:
SPEC-012

Title:
Address CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 13

Module:
Address

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Customer module as the primary reference implementation.

Follow the existing architecture exactly.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, formatting, comments and folder structure.

If Prisma schema changes are required:

- Update schema.prisma
- Create and apply a migration
- Regenerate Prisma Client
- Compile the application
- Resolve all TypeScript errors before completion.

---

# Objective

Implement the complete Address CRUD module.

Addresses belong to Customers.

A Customer may have multiple addresses.

For MVP, addresses will support both billing and shipping.

Future specifications will introduce:

- Default billing address
- Default shipping address
- Address validation
- Google Places integration
- Address verification

Do not implement these features in this specification.

---

# Reference Implementations

Use

Customer

↓

Supplier

↓

Warehouse

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

If Address does not already exist, create it.

Suggested MVP model

model Address {

  id String @id @default(uuid())

  type AddressType

  line1 String

  line2 String?

  suburb String?

  city String

  province String

  postalCode String

  country String

  contactName String?

  contactPhone String?

  company String?

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  customerId String

  customer Customer
    @relation(fields: [customerId], references: [id])

  @@index([customerId])

  @@map("addresses")

}

Create enum

enum AddressType {

  SHIPPING

  BILLING

}

Update Customer

addresses Address[]

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/customers/controllers/AddressController.ts

src/modules/customers/routes/address.routes.ts

src/modules/customers/types/address.dto.ts

src/modules/customers/validation/address.validation.ts

---

## Replace

src/modules/customers/services/AddressService.ts

src/modules/customers/controllers/index.ts

src/modules/customers/routes/index.ts

src/modules/customers/services/index.ts

src/modules/customers/types/index.ts

src/modules/customers/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateAddressDto

Fields

type

line1

line2?

suburb?

city

province

postalCode

country

contactName?

contactPhone?

company?

customerId

---

UpdateAddressDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateAddress()

Rules

type required

line1 required

city required

province required

postalCode required

country required

customerId required

---

Implement

validateUpdateAddress()

Rules

If supplied

line1 must not be empty

city must not be empty

province must not be empty

postalCode must not be empty

country must not be empty

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

AddressController

Methods

getAddresses()

getAddress()

createAddress()

updateAddress()

deleteAddress()

Responsibilities

Receive request

↓

Validate DTO

↓

Call AddressService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace AddressService.

Extend BaseService.

Implement

getAddress()

getAddresses()

createAddress()

updateAddress()

deleteAddress()

Use

Prisma.AddressCreateInput

Prisma.AddressUpdateInput

Connect Address to Customer using customerId.

No nested creates.

---

# Routes

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Follow the same routing implementation as Customer.

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

/api/v1/addresses

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

A Customer may own multiple addresses.

Address must always belong to one Customer.

Address type must be either

SHIPPING

or

BILLING.

No default address logic in this specification.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/addresses

works.

GET

/api/v1/addresses/:id

works.

POST

creates Address.

PUT

updates Address.

DELETE

removes Address.

404 returned when Address not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure at least one Customer exists.

Record Customer ID.

---

# Test 1

GET

/api/v1/addresses

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/addresses

Body

{
    "type": "SHIPPING",
    "line1": "15 Main Road",
    "city": "Cape Town",
    "province": "Western Cape",
    "postalCode": "8001",
    "country": "South Africa",
    "customerId": "<customer-id>"
}

Expected

HTTP 201

Address created.

Save Address ID.

---

# Test 3

GET

/api/v1/addresses/<address-id>

Expected

HTTP 200

Correct Address returned.

---

# Test 4

PUT

/api/v1/addresses/<address-id>

Body

{
    "line1": "27 Main Road",
    "postalCode": "8005"
}

Expected

HTTP 200

Address updated.

---

# Test 5

GET

/api/v1/addresses/<address-id>

Verify update.

---

# Test 6

DELETE

/api/v1/addresses/<address-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/addresses/<address-id>

Expected

HTTP 404

{
    "message": "Address not found."
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

feat(customers): implement Address CRUD

---

# End Specification