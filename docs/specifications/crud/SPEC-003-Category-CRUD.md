# PCS Core Engineering Specification

Specification ID:
SPEC-003

Version:
1.0

Sprint:
Sprint 4

Module:
Category

Status:
Ready for Implementation

Author:
ChatGPT

---

# Instructions for GitHub Copilot

Read this entire specification before generating any code.

The Brand and Sport modules are the canonical implementations.

Do not redesign the architecture.

Do not introduce new abstractions.

Do not refactor unrelated code.

Maintain the existing coding style, spacing, comments and file structure.

The objective is to make Category indistinguishable from Brand and Sport from an architectural perspective.

Implement production-ready code.

---

# Objective

Implement the complete Category CRUD module.

After implementation the following endpoints must be available.

GET /api/v1/categories

GET /api/v1/categories/:id

POST /api/v1/categories

PUT /api/v1/categories/:id

DELETE /api/v1/categories/:id

The implementation must follow the existing Brand and Sport modules exactly.

---

# Reference Implementation

Brand Module

Sport Module

These are the only reference implementations.

---

# Existing Architecture

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

src/modules/catalog/controllers/CategoryController.ts

src/modules/catalog/routes/category.routes.ts

src/modules/catalog/types/category.dto.ts

src/modules/catalog/validation/category.validation.ts

---

## Replace

src/modules/catalog/services/CategoryService.ts

src/modules/catalog/controllers/index.ts

src/modules/catalog/routes/index.ts

src/modules/catalog/services/index.ts

src/modules/catalog/types/index.ts

src/modules/catalog/validation/index.ts

src/app.ts

---

# Controller Requirements

Create CategoryController.

Use SportController as the implementation template.

The controller must expose:

getCategories()

getCategory()

createCategory()

updateCategory()

deleteCategory()

Requirements

- Use ApiResponse
- Use IdParams
- Use DTOs
- Use Validation
- Use CategoryService
- No business logic
- No Prisma access

---

# DTO Requirements

Create category.dto.ts

Create

CreateCategoryDto

UpdateCategoryDto

Fields

CreateCategoryDto

name

description?

displayOrder?

sportId

UpdateCategoryDto

name?

description?

displayOrder?

sportId?

Follow Brand DTO conventions exactly.

---

# Validation Requirements

Create category.validation.ts

Create

validateCreateCategory()

validateUpdateCategory()

Rules

Create

Category name required

Update

If name supplied

must not be empty

Validation must not access Prisma.

Validation must not contain business logic.

---

# Service Requirements

Replace CategoryService.

Use BrandService as the canonical implementation.

Extend

BaseService

Queries

getCategory()

getCategories()

Commands

createCategory()

updateCategory()

deleteCategory()

Create

Generate slug using

slugService

Generate category code using

categoryCodeService

CreateInput

Use Prisma.CategoryCreateInput

UpdateInput

Use Prisma.CategoryUpdateInput

Relationships

Connect Category to Sport

using

sportId

Do not modify existing business rules outside Category.

---

# Routes

Create

category.routes.ts

Implement

GET /

GET /:id

POST /

PUT /:id

DELETE /:id

Every route must use

try

catch

next(error)

exactly as Brand and Sport.

---

# Route Registration

Update

routes/index.ts

Export

categoryRoutes

---

# Controller Registration

Update

controllers/index.ts

Export

CategoryController

categoryController

---

# Service Registration

Update

services/index.ts

Export

CategoryService

categoryService

---

# DTO Registration

Update

types/index.ts

Export

category.dto

---

# Validation Registration

Update

validation/index.ts

Export

category.validation

---

# Application Registration

Update

src/app.ts

Register

app.use('/api/v1/categories', categoryRoutes);

Maintain existing Brand and Sport registrations.

---

# Coding Standards

Follow existing project formatting exactly.

Section headers

Imports

Queries

Commands

Service Instance

Controller Instance

Use async/await.

No inline business logic inside controllers.

No duplicated code.

No console.log statements.

No TODO comments unless already present.

---

# Acceptance Criteria

Application compiles.

GET

/api/v1/categories

returns all categories.

GET

/api/v1/categories/:id

returns one category.

POST

creates category.

PUT

updates category.

DELETE

removes category.

404 returned when category not found.

Responses use ApiResponse.

Relationships to Sport function correctly.

---

# Manual Testing

Create

Sport

↓

Create

Category

↓

Retrieve Category

↓

Update Category

↓

Retrieve Category

↓

Delete Category

↓

Verify deletion

---

# Expected Result

The Category module should be architecturally identical to the Brand and Sport modules.

The only differences should be business-specific naming and Category relationships.

---

# Definition of Done

Application compiles.

All five endpoints function.

No TypeScript errors.

No ESLint errors.

No architectural deviations.

Ready for commit.

---

# Commit Message

feat(catalog): implement Category CRUD

---

# End Specification