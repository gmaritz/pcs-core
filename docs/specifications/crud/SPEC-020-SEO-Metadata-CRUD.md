# PCS Core Engineering Specification

Specification:
SPEC-020

Title:
SEO Metadata CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 21

Module:
SEO Metadata

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Product, Category and Media modules as the primary reference implementations.

Follow the existing PCS Core architecture exactly.

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

Implement the complete SEO Metadata CRUD module.

SEO Metadata stores search engine optimisation information that can be associated with Products during the MVP.

The model is intentionally generic so it can later be extended to Categories, Brands, CMS pages and blog articles.

Future specifications will introduce:

- Canonical URL generation
- XML sitemap generation
- Robots directives
- Open Graph image generation
- Structured Data (JSON-LD)
- Automatic metadata generation

Do not implement these features in this specification.

---

# Reference Implementations

Use

Product

↓

Media

↓

Category

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

If SeoMetadata does not already exist, create it.

Suggested MVP model

model SeoMetadata {

  id String @id @default(uuid())

  metaTitle String

  metaDescription String?

  metaKeywords String?

  canonicalUrl String?

  ogTitle String?

  ogDescription String?

  ogImageUrl String?

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  productId String @unique

  product Product
    @relation(fields: [productId], references: [id])

  @@map("seo_metadata")

}

Update Product

seoMetadata SeoMetadata?

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/content/controllers/SeoMetadataController.ts

src/modules/content/routes/seo-metadata.routes.ts

src/modules/content/types/seo-metadata.dto.ts

src/modules/content/validation/seo-metadata.validation.ts

---

## Replace

src/modules/content/services/SeoMetadataService.ts

src/modules/content/controllers/index.ts

src/modules/content/routes/index.ts

src/modules/content/services/index.ts

src/modules/content/types/index.ts

src/modules/content/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateSeoMetadataDto

Fields

productId

metaTitle

metaDescription?

metaKeywords?

canonicalUrl?

ogTitle?

ogDescription?

ogImageUrl?

---

UpdateSeoMetadataDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateSeoMetadata()

Rules

productId required

metaTitle required

---

Implement

validateUpdateSeoMetadata()

Rules

metaTitle must not be empty if supplied

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

SeoMetadataController

Methods

getSeoMetadata()

getSeoMetadataItem()

createSeoMetadata()

updateSeoMetadata()

deleteSeoMetadata()

Responsibilities

Receive request

↓

Validate DTO

↓

Call SeoMetadataService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace SeoMetadataService.

Extend BaseService.

Implement

getSeoMetadata()

getSeoMetadataItem()

createSeoMetadata()

updateSeoMetadata()

deleteSeoMetadata()

Use

Prisma.SeoMetadataCreateInput

Prisma.SeoMetadataUpdateInput

Connect Product using productId.

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

/api/v1/seo-metadata

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

Each Product may have one SEO Metadata record.

SEO Metadata cannot exist without a Product.

No automatic metadata generation.

No sitemap generation.

No Open Graph image processing.

Metadata only.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/seo-metadata

works.

GET

/api/v1/seo-metadata/:id

works.

POST

creates SEO Metadata.

PUT

updates SEO Metadata.

DELETE

removes SEO Metadata.

404 returned when SEO Metadata not found.

Responses use ApiResponse.

---

# Verification Suite

## Pre-requisites

Ensure a Product exists.

Record the Product ID.

---

# Test 1

GET

/api/v1/seo-metadata

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/seo-metadata

Body

{
    "productId": "<product-id>",
    "metaTitle": "Wilson Pro Staff RF97 Tennis Racquet",
    "metaDescription": "Premium Wilson Pro Staff RF97 tennis racquet available from Pro Court Sports.",
    "metaKeywords": "Wilson,RF97,Tennis Racquet",
    "canonicalUrl": "https://www.procourtsports.co.za/products/wilson-pro-staff-rf97",
    "ogTitle": "Wilson Pro Staff RF97",
    "ogDescription": "Professional tennis racquet.",
    "ogImageUrl": "/uploads/products/wilson-rf97.jpg"
}

Expected

HTTP 201

SEO Metadata created.

Save SEO Metadata ID.

---

# Test 3

GET

/api/v1/seo-metadata/<seo-metadata-id>

Expected

HTTP 200

Correct SEO Metadata returned.

---

# Test 4

PUT

/api/v1/seo-metadata/<seo-metadata-id>

Body

{
    "metaTitle": "Wilson Pro Staff RF97 v14",
    "metaDescription": "Updated SEO description."
}

Expected

HTTP 200

SEO Metadata updated.

---

# Test 5

GET

/api/v1/seo-metadata/<seo-metadata-id>

Verify update.

---

# Test 6

DELETE

/api/v1/seo-metadata/<seo-metadata-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/seo-metadata/<seo-metadata-id>

Expected

HTTP 404

{
    "message": "SEO Metadata not found."
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

☐ Commit completed

---

# Commit Message

feat(content): implement SEO Metadata CRUD

---

# End Specification