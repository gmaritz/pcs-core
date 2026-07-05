# PCS Core Engineering Specification

Specification:
SPEC-004

Title:
Product CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 5

Module:
Product

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this entire specification before generating code.

Use the completed Brand, Sport and Category modules as the canonical implementation.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, spacing, comments and folder structure.

Implement production-ready code.

---

# Objective

Implement the complete Product CRUD module.

The Product module becomes the central entity of the Catalog domain.

Implement only MVP functionality.

Future specifications will add:

- Product Variants
- Product Images
- Product Attributes
- Product Specifications
- Inventory
- Supplier Products

Do not implement these now.

---

# Reference Implementations

Use the following modules as references.

1. Category
2. Sport
3. Brand

The Product module must follow exactly the same architecture.

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

This architecture must not change.

---

# Files

## Create

src/modules/catalog/controllers/ProductController.ts

src/modules/catalog/routes/product.routes.ts

src/modules/catalog/types/product.dto.ts

src/modules/catalog/validation/product.validation.ts

---

## Replace

src/modules/catalog/services/ProductService.ts

src/modules/catalog/controllers/index.ts

src/modules/catalog/routes/index.ts

src/modules/catalog/services/index.ts

src/modules/catalog/types/index.ts

src/modules/catalog/validation/index.ts

src/app.ts

---

# DTO Requirements

Create

CreateProductDto

Fields

name

description?

displayOrder?

sportId

brandId

categoryId

---

Create

UpdateProductDto

All fields optional.

---

# Validation Requirements

Create

validateCreateProduct()

Rules

Product name required.

---

Create

validateUpdateProduct()

Rules

If name supplied

must not be empty.

Validation must not access Prisma.

Validation contains no business logic.

---

# Controller Requirements

Create ProductController.

Implement

getProducts()

getProduct()

createProduct()

updateProduct()

deleteProduct()

Controller responsibilities

- Receive requests
- Validate DTO
- Call ProductService
- Return ApiResponse

No business logic.

No Prisma access.

---

# Service Requirements

Replace ProductService.

Extend

BaseService

Implement

getProduct()

getProducts()

createProduct()

updateProduct()

deleteProduct()

Use

Prisma.ProductCreateInput

Prisma.ProductUpdateInput

Use

slugService

Use

productCodeService

If productCodeService does not yet exist,
implement temporary product code generation
identical to Sport.

Generate

slug

product code

Connect Product to

Sport

Brand

Category

using Prisma connect.

No nested creates.

---

# Routes

Create

product.routes.ts

Implement

GET /

GET /:id

POST /

PUT /:id

DELETE /

Use identical routing style to Category.

Every route uses

try

catch

next(error)

---

# Registration

Update

controllers/index.ts

Export

ProductController

productController

---

Update

services/index.ts

Export

ProductService

productService

---

Update

types/index.ts

Export

product.dto

---

Update

validation/index.ts

Export

product.validation

---

Update

routes/index.ts

Export

productRoutes

---

Update

src/app.ts

Register

app.use('/api/v1/products', productRoutes);

Maintain existing route registrations.

---

# Coding Standards

Follow existing project formatting exactly.

Maintain section headers.

Maintain spacing.

Maintain comments.

Maintain async/await.

No console.log statements.

No TODO comments.

No new architecture.

---

# Business Rules

Product Code

Generated automatically.

Slug

Generated automatically.

Name change

Updates slug.

Product code remains unchanged.

Relationships

Connect to

Sport

Brand

Category

using IDs.

---

# Acceptance Criteria

Application compiles.

No TypeScript errors.

No ESLint errors.

GET

/api/v1/products

works.

GET

/api/v1/products/:id

works.

POST

creates Product.

PUT

updates Product.

DELETE

removes Product.

404 returned when Product not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Create

Sport

Brand

Category

Record all IDs.

---

# Test 1

GET

/api/v1/products

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/products

Body

{
    "name": "Wilson Pro Staff RF97",
    "description": "Professional tennis racquet",
    "displayOrder": 1,
    "sportId": "<sport-id>",
    "brandId": "<brand-id>",
    "categoryId": "<category-id>"
}

Expected

HTTP 201

Product created.

Save Product ID.

---

# Test 3

GET

/api/v1/products/<product-id>

Expected

HTTP 200

Correct Product returned.

---

# Test 4

PUT

/api/v1/products/<product-id>

Body

{
    "description": "Updated description",
    "displayOrder": 2
}

Expected

HTTP 200

Updated Product returned.

---

# Test 5

GET

/api/v1/products/<product-id>

Verify update.

---

# Test 6

DELETE

/api/v1/products/<product-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/products/<product-id>

Expected

HTTP 404

{
    "message": "Product not found."
}

---

# Completion Checklist

☐ Application compiles

☐ No TypeScript errors

☐ GET All passed

☐ GET By ID passed

☐ POST passed

☐ PUT passed

☐ DELETE passed

☐ Relationships verified

☐ Commit completed

---

# Commit Message

feat(catalog): implement Product CRUD

---

# End Specification