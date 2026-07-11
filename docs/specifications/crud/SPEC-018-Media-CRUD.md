# PCS Core Engineering Specification

Specification:
SPEC-018

Title:
Media CRUD

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 19

Module:
Media

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this specification completely before generating any code.

Use the completed Product, Product Variant and Supplier Product modules as the implementation standard.

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

Implement the complete Media CRUD module.

Media represents a physical media asset stored by PCS Core.

The Media entity is intentionally independent from Products.

Products will reference Media through the ProductMedia module implemented in SPEC-019.

For MVP this specification stores metadata only.

Actual image uploads will be implemented later.

---

# Reference Implementations

Use

Product

↓

Supplier Product

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

If Media does not already exist, create it.

Suggested MVP model

model Media {

  id String @id @default(uuid())

  filename String

  originalFilename String?

  mimeType String

  extension String

  url String

  altText String?

  title String?

  description String?

  width Int?

  height Int?

  fileSize Int?

  displayOrder Int @default(0)

  status RecordStatus @default(ACTIVE)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  @@index([displayOrder])

  @@index([filename])

  @@map("media")

}

Create migration.

Apply migration.

Generate Prisma Client.

---

# Files

## Create

src/modules/content/controllers/MediaController.ts

src/modules/content/routes/media.routes.ts

src/modules/content/types/media.dto.ts

src/modules/content/validation/media.validation.ts

---

## Replace

src/modules/content/services/MediaService.ts

src/modules/content/controllers/index.ts

src/modules/content/routes/index.ts

src/modules/content/services/index.ts

src/modules/content/types/index.ts

src/modules/content/validation/index.ts

src/app.ts

---

# DTO Requirements

CreateMediaDto

Fields

filename

originalFilename?

mimeType

extension

url

altText?

title?

description?

width?

height?

fileSize?

displayOrder?

---

UpdateMediaDto

All fields optional.

---

# Validation Requirements

Implement

validateCreateMedia()

Rules

filename required

mimeType required

extension required

url required

---

Implement

validateUpdateMedia()

Rules

filename must not be empty if supplied

url must not be empty if supplied

Validation must not access Prisma.

No business logic.

---

# Controller Requirements

Implement

MediaController

Methods

getMedia()

getMediaItem()

createMedia()

updateMedia()

deleteMedia()

Responsibilities

Receive request

↓

Validate DTO

↓

Call MediaService

↓

Return ApiResponse

No business logic.

---

# Service Requirements

Replace MediaService.

Extend BaseService.

Implement

getMedia()

getMediaItem()

createMedia()

updateMedia()

deleteMedia()

Use

Prisma.MediaCreateInput

Prisma.MediaUpdateInput

No nested creates.

No file upload logic.

Store metadata only.

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

/api/v1/media

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

Media represents one stored asset.

Media is independent of Products.

Media may later be linked to multiple entities.

No upload functionality.

No image processing.

Metadata only.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Prisma Client generated.

GET

/api/v1/media

works.

GET

/api/v1/media/:id

works.

POST

creates Media.

PUT

updates Media.

DELETE

removes Media.

404 returned when Media not found.

Responses use ApiResponse.

---

# Verification Suite

# Test 1

GET

/api/v1/media

Expected

HTTP 200

Returns array.

---

# Test 2

POST

/api/v1/media

Body

{
    "filename": "wilson-rf97.jpg",
    "originalFilename": "RF97.jpg",
    "mimeType": "image/jpeg",
    "extension": ".jpg",
    "url": "/uploads/products/wilson-rf97.jpg",
    "altText": "Wilson Pro Staff RF97",
    "title": "Wilson RF97",
    "description": "Main product image",
    "width": 1200,
    "height": 1200,
    "fileSize": 245612,
    "displayOrder": 1
}

Expected

HTTP 201

Media created.

Save Media ID.

---

# Test 3

GET

/api/v1/media/<media-id>

Expected

HTTP 200

Correct Media returned.

---

# Test 4

PUT

/api/v1/media/<media-id>

Body

{
    "altText": "Wilson RF97 Tennis Racquet",
    "displayOrder": 2
}

Expected

HTTP 200

Media updated.

---

# Test 5

GET

/api/v1/media/<media-id>

Verify update.

---

# Test 6

DELETE

/api/v1/media/<media-id>

Expected

HTTP 204

---

# Test 7

GET

/api/v1/media/<media-id>

Expected

HTTP 404

{
    "message": "Media not found."
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

☐ Commit completed

---

# Commit Message

feat(content): implement Media CRUD

---

# End Specification