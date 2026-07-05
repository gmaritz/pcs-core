# PCS Core Architecture & Development Handbook

# Chapter 13

# Catalog Module Blueprint

---

# Purpose

This document defines the canonical implementation pattern for every
Catalog domain module.

The Brand module is the reference implementation.

Every future Catalog entity must follow this blueprint unless a
documented architectural decision states otherwise.

Current Catalog Modules:

- Brand
- Sport
- Category
- Product
- Product Variant

Future modules should be added without changing the architectural pattern.

---

# Module Structure

Every Catalog module follows the same directory layout.

```
catalog/

└── entity/

    controllers/
        EntityController.ts

    routes/
        entity.routes.ts

    services/
        EntityService.ts

    validation/
        entity.validation.ts

    types/
        entity.dto.ts
```

The purpose of consistency is:

- easier maintenance
- predictable navigation
- lower cognitive load
- faster development

---

# Responsibilities

---

## Controller

Responsible for HTTP concerns only.

Responsibilities:

- Receive HTTP requests
- Validate DTOs
- Call Services
- Return API responses

Controllers must never contain business rules.

Controllers must never access Prisma directly.

Controllers must remain thin.

---

## Service

Responsible for business logic.

Responsibilities:

- Execute business rules
- Coordinate repositories / Prisma
- Generate business values
- Enforce invariants

Examples:

Brand

- Generate Brand Code
- Generate Slug

Product

- Calculate SKU
- Validate Product relationships

Services own the business logic.

---

## Validation

Responsible for validating incoming DTOs.

Validation must:

- verify required fields
- verify empty strings
- verify simple formats

Validation must not:

- access the database
- contain business logic

---

## DTO

DTOs define the HTTP contract.

Each entity should provide:

Create<Entity>Dto

Update<Entity>Dto

DTOs isolate the API layer from Prisma.

Controllers work only with DTOs.

---

## Routes

Routes define HTTP endpoints only.

Responsibilities:

- Route mapping
- Call controller
- Forward exceptions

Routes contain no business logic.

---

# Shared Components

Controllers should use:

ApiResponse

Validation should remain inside the module.

Business helpers that may be reused belong under:

modules/shared/services

Examples:

SlugService

BrandCodeService

Future examples:

SkuService

SeoService

BarcodeService

---

# Dependency Flow

```
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
```

Dependencies always flow downward.

Reverse dependencies are not allowed.

---

# Controller Rules

Controllers should resemble the following pattern.

```
Receive Request

↓

Validate DTO

↓

Call Service

↓

Return ApiResponse
```

Nothing more.

---

# Service Rules

Services should:

- be stateless
- contain business logic
- return domain objects
- never return HTTP responses

---

# API Response Rules

Controllers never call:

res.status(...)

directly unless absolutely necessary.

Instead they should use:

ApiResponse.success()

ApiResponse.created()

ApiResponse.notFound()

ApiResponse.noContent()

---

# Error Handling

Business outcomes are not exceptions.

Example:

Brand not found

↓

404 Response

Unexpected failures should propagate to the global error middleware.

---

# Naming Conventions

Controllers

EntityController

Services

EntityService

Routes

entity.routes.ts

Validation

entity.validation.ts

DTO

entity.dto.ts

---

# Development Workflow

Every feature follows the same process.

1. Define one objective.

2. Implement.

3. Compile.

4. Execute.

5. Test.

6. Verify.

7. Commit.

Repeat.

Iteration is king.

---

# Engineering Principles

## Principle 1

Iteration is King.

Build the smallest complete piece of functionality.

---

## Principle 2

Evidence before Changes.

Observe the running application before modifying code.

---

## Principle 3

Complete Files.

Implementation iterations provide complete files rather than snippets.

---

## Principle 4

Clone before Create.

New modules begin from the proven blueprint.

Domain-specific behaviour is added afterwards.

---

# Status

Version

1.0

Status

Approved

Reference Implementation

Brand Module

Next Module

Sport# PCS Core Architecture & Development Handbook

# Chapter 13

# Catalog Module Blueprint

---

# Purpose

This document defines the canonical implementation pattern for every
Catalog domain module.

The Brand module is the reference implementation.

Every future Catalog entity must follow this blueprint unless a
documented architectural decision states otherwise.

Current Catalog Modules:

- Brand
- Sport
- Category
- Product
- Product Variant

Future modules should be added without changing the architectural pattern.

---

# Module Structure

Every Catalog module follows the same directory layout.

```
catalog/

└── entity/

    controllers/
        EntityController.ts

    routes/
        entity.routes.ts

    services/
        EntityService.ts

    validation/
        entity.validation.ts

    types/
        entity.dto.ts
```

The purpose of consistency is:

- easier maintenance
- predictable navigation
- lower cognitive load
- faster development

---

# Responsibilities

---

## Controller

Responsible for HTTP concerns only.

Responsibilities:

- Receive HTTP requests
- Validate DTOs
- Call Services
- Return API responses

Controllers must never contain business rules.

Controllers must never access Prisma directly.

Controllers must remain thin.

---

## Service

Responsible for business logic.

Responsibilities:

- Execute business rules
- Coordinate repositories / Prisma
- Generate business values
- Enforce invariants

Examples:

Brand

- Generate Brand Code
- Generate Slug

Product

- Calculate SKU
- Validate Product relationships

Services own the business logic.

---

## Validation

Responsible for validating incoming DTOs.

Validation must:

- verify required fields
- verify empty strings
- verify simple formats

Validation must not:

- access the database
- contain business logic

---

## DTO

DTOs define the HTTP contract.

Each entity should provide:

Create<Entity>Dto

Update<Entity>Dto

DTOs isolate the API layer from Prisma.

Controllers work only with DTOs.

---

## Routes

Routes define HTTP endpoints only.

Responsibilities:

- Route mapping
- Call controller
- Forward exceptions

Routes contain no business logic.

---

# Shared Components

Controllers should use:

ApiResponse

Validation should remain inside the module.

Business helpers that may be reused belong under:

modules/shared/services

Examples:

SlugService

BrandCodeService

Future examples:

SkuService

SeoService

BarcodeService

---

# Dependency Flow

```
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
```

Dependencies always flow downward.

Reverse dependencies are not allowed.

---

# Controller Rules

Controllers should resemble the following pattern.

```
Receive Request

↓

Validate DTO

↓

Call Service

↓

Return ApiResponse
```

Nothing more.

---

# Service Rules

Services should:

- be stateless
- contain business logic
- return domain objects
- never return HTTP responses

---

# API Response Rules

Controllers never call:

res.status(...)

directly unless absolutely necessary.

Instead they should use:

ApiResponse.success()

ApiResponse.created()

ApiResponse.notFound()

ApiResponse.noContent()

---

# Error Handling

Business outcomes are not exceptions.

Example:

Brand not found

↓

404 Response

Unexpected failures should propagate to the global error middleware.

---

# Naming Conventions

Controllers

EntityController

Services

EntityService

Routes

entity.routes.ts

Validation

entity.validation.ts

DTO

entity.dto.ts

---

# Development Workflow

Every feature follows the same process.

1. Define one objective.

2. Implement.

3. Compile.

4. Execute.

5. Test.

6. Verify.

7. Commit.

Repeat.

Iteration is king.

---

# Engineering Principles

## Principle 1

Iteration is King.

Build the smallest complete piece of functionality.

---

## Principle 2

Evidence before Changes.

Observe the running application before modifying code.

---

## Principle 3

Complete Files.

Implementation iterations provide complete files rather than snippets.

---

## Principle 4

Clone before Create.

New modules begin from the proven blueprint.

Domain-specific behaviour is added afterwards.

---

# Status

Version

1.0

Status

Approved

Reference Implementation

Brand Module

Next Module

Sport