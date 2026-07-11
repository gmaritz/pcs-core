# PCS Core Engineering Specification

Specification:
SPEC-011

Title:
Customer CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 12

Module:
Customer

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Supplier, Product and Inventory modules as the implementation standard.

Follow the existing architecture exactly.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, formatting, comments and folder structure.

If Prisma schema changes are required:

- Update schema.prisma
- Create and apply a migration
- Regenerate Prisma Client
- Compile the project
- Resolve all TypeScript errors

The generated code must compile successfully.

---

# Objective

Implement the complete Customer CRUD module.

Customer represents a registered shopper within PCS Core.

This specification only establishes the Customer master record.

Future specifications will introduce:

- Customer authentication
- Password hashing
- Email verification
- Customer addresses
- Customer wishlists
- Customer order history
- Loyalty programme

Do not implement these features in this specification.

---

# Reference Implementations

Use

Supplier

↓

Product

↓

Category

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

If Customer does not already exist, create it.

Suggested MVP model

model Customer {

  id String @id @default(uuid())

  firstName String

  lastName String

  email String @unique

  telephone String?

  company String?

  status RecordStatus @default(ACTIVE)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  @@index([lastName])

  @@map("customers")

}

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/customers/controllers/CustomerController.ts

src/modules/customers/routes/customer.routes.ts

src/modules/customers/types/customer.dto.ts

src/modules/customers/validation/customer.validation.ts

---

## Replace

src/modules/customers/services/CustomerService.ts

src/modules/customers/controllers/index.ts

src/modules/customers/routes/index.ts

src/modules/customers/services/index.ts

src/modules/customers/types/index.ts

src/modules/customers/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateCustomerDto

Fields

firstName

lastName

email

telephone?

company?

---

UpdateCustomerDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateCustomer()

Rules

firstName required

lastName required

email required

email must be valid

---

Implement

validateUpdateCustomer()

Rules

If email supplied

must be valid

If firstName supplied

must not be empty

If lastName supplied

must not be empty

Validation contains no Prisma access.

Validation contains no business logic.

---

# Controller Requirements

Implement

CustomerController

Methods

getCustomers()

getCustomer()

createCustomer()

updateCustomer()

deleteCustomer()

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

Replace CustomerService.

Extend BaseService.

Implement

getCustomer()

getCustomers()

createCustomer()

updateCustomer()

deleteCustomer()

Use

Prisma.CustomerCreateInput

Prisma.CustomerUpdateInput

No additional business logic.

No password handling.

No authentication.

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

/api/v1/customers

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

Email address must be unique.

Customer status defaults to ACTIVE.

Customer may exist without a company.

No authentication implemented.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/customers

works.

GET

/api/v1/customers/:id

works.

POST

creates Customer.

PUT

updates Customer.

DELETE

removes Customer.

404 returned when Customer not found.

Responses use ApiResponse.

---

# Verification Suite

# Test 1

GET

/api/v1/customers

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/customers

Body

{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "telephone": "+27 82 123 4567",
    "company": "Smith Sports"
}

Expected

HTTP 201

Customer created.

Save Customer ID.

---

# Test 3

GET

/api/v1/customers/<customer-id>

Expected

HTTP 200

Correct Customer returned.

---

# Test 4

PUT

/api/v1/customers/<customer-id>

Body

{
    "telephone": "+27 82 999 9999",
    "company": "Smith Sports (Pty) Ltd"
}

Expected

HTTP 200

Customer updated.

---

# Test 5

GET

/api/v1/customers/<customer-id>

Verify update.

---

# Test 6

DELETE

/api/v1/customers/<customer-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/customers/<customer-id>

Expected

HTTP 404

{
    "message": "Customer not found."
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

☐ Email uniqueness verified

☐ Commit completed

---

# Commit Message

feat(customers): implement Customer CRUD

---

# End Specification