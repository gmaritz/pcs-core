# PCS Core Engineering Specification

Specification:
SPEC-019

Title:
Product Media CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 20

Module:
Product Media

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Product and Media modules as the primary reference implementations.

Follow the existing PCS Core architecture exactly.

Do not redesign the architecture.

Do not introduce new abstractions.

Maintain the existing coding style, formatting, comments and folder structure.

If Prisma schema changes are required:

- Update schema.prisma
- Create and apply a migration
- Regenerate the Prisma Client
- Compile the application
- Resolve all TypeScript errors before completion

The implementation must compile successfully.

---

# Objective

Implement the complete Product Media CRUD module.

Product Media represents the relationship between Products and Media assets.

A Product may have many Media records.

A Media record may be shared by multiple Products.

For MVP this module stores relationship metadata only.

Image upload, resizing, watermarking and CDN integration are implemented in future specifications.

---

# Reference Implementations

Use

Product

↓

Media

↓

Supplier Product

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

If ProductMedia does not already exist, create it.

Suggested MVP model

model ProductMedia {

  id String @id @default(uuid())

  mediaRole MediaRole @default(GALLERY)

  displayOrder Int @default(0)

  isPrimary Boolean @default(false)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  productId String

  product Product
    @relation(fields: [productId], references: [id])

  mediaId String

  media Media
    @relation(fields: [mediaId], references: [id])

  @@unique([productId, mediaId])

  @@index([productId])

  @@index([mediaId])

  @@map("product_media")

}

Create enum

enum MediaRole {

  PRIMARY

  GALLERY

  THUMBNAIL

  HERO

}

Update Product

media ProductMedia[]

Update Media

products ProductMedia[]

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/content/controllers/ProductMediaController.ts

src/modules/content/routes/product-media.routes.ts

src/modules/content/types/product-media.dto.ts

src/modules/content/validation/product-media.validation.ts

---

## Replace

src/modules/content/services/ProductMediaService.ts

src/modules/content/controllers/index.ts

src/modules/content/routes/index.ts

src/modules/content/services/index.ts

src/modules/content/types/index.ts

src/modules/content/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateProductMediaDto

Fields

productId

mediaId

mediaRole?

displayOrder?

isPrimary?

---

UpdateProductMediaDto

Fields

mediaRole?

displayOrder?

isPrimary?

---

# Validation Requirements

Implement

validateCreateProductMedia()

Rules

productId required

mediaId required

---

Implement

validateUpdateProductMedia()

Rules

displayOrder >= 0 if supplied

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

ProductMediaController

Methods

getProductMedia()

getProductMediaItem()

createProductMedia()

updateProductMedia()

deleteProductMedia()

Responsibilities

Receive request

↓

Validate DTO

↓

Call ProductMediaService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace ProductMediaService.

Extend BaseService.

Implement

getProductMedia()

getProductMediaItem()

createProductMedia()

updateProductMedia()

deleteProductMedia()

Use

Prisma.ProductMediaCreateInput

Prisma.ProductMediaUpdateInput

Connect

Product

using productId

Connect

Media

using mediaId

No nested creates.

---

# Routes

Implement

GET /

GET /:id

POST /

PUT /

DELETE /

Maintain existing routing implementation.

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

/api/v1/product-media

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

A Product may have many Media assets.

A Media asset may belong to multiple Products.

Only one Product/Media relationship may exist.

isPrimary identifies the preferred image.

No enforcement that only one image is primary in MVP.

No upload logic.

No resizing.

No CDN integration.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/product-media

works.

GET

/api/v1/product-media/:id

works.

POST

creates Product Media.

PUT

updates Product Media.

DELETE

removes Product Media.

404 returned when Product Media not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure the following records exist.

Product

↓

Media

Record both IDs.

---

# Test 1

GET

/api/v1/product-media

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/product-media

Body

{
    "productId": "<product-id>",
    "mediaId": "<media-id>",
    "mediaRole": "PRIMARY",
    "displayOrder": 1,
    "isPrimary": true
}

Expected

HTTP 201

Relationship created.

Save Product Media ID.

---

# Test 3

GET

/api/v1/product-media/<product-media-id>

Expected

HTTP 200

Correct relationship returned.

---

# Test 4

PUT

/api/v1/product-media/<product-media-id>

Body

{
    "displayOrder": 2,
    "mediaRole": "GALLERY",
    "isPrimary": false
}

Expected

HTTP 200

Relationship updated.

---

# Test 5

GET

/api/v1/product-media/<product-media-id>

Verify update.

---

# Test 6

DELETE

/api/v1/product-media/<product-media-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/product-media/<product-media-id>

Expected

HTTP 404

{
    "message": "Product Media not found."
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

☐ Product relationship verified

☐ Media relationship verified

☐ Commit completed

---

# Commit Message

feat(content): implement Product Media CRUD

---

# End Specification