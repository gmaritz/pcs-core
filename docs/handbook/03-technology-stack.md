# PCS Core Architecture & Development Handbook

## Chapter 03 — Project Structure & Organization

---

**Document Version:** 1.0.0

**Document Status:** Draft

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Author:** Pro Court Sports Engineering

**Last Updated:** 2026-06-27

---

# Revision History

| Version | Date       | Description   |
| ------- | ---------- | ------------- |
| 1.0.0   | 2026-06-27 | Initial draft |

---

# 1. Purpose

This chapter defines the physical organisation of the PCS Core source code.

Its objective is to establish a predictable, scalable and maintainable project structure that supports long-term development.

A developer joining the project should be able to locate any file within thirty seconds.

Project organisation should communicate business intent rather than framework implementation.

---

# 2. Organisation Principles

PCS Core follows the following organisational principles:

* Organise by business capability.
* Minimise coupling between modules.
* Maximise cohesion within modules.
* Separate infrastructure from business logic.
* Keep reusable components in shared libraries.
* Prefer explicit structure over convention.

Every folder must have a clearly defined responsibility.

---

# 3. Root Project Structure

```text
pcs-core/

├── docs/
│   ├── handbook/
│   ├── decisions/
│   ├── diagrams/
│   └── meeting-notes/
│
├── prisma/
│
├── public/
│
├── scripts/
│
├── src/
│
├── tests/
│
├── .github/
│
├── package.json
├── tsconfig.json
├── README.md
├── .env
├── .env.example
└── .gitignore
```

---

# 4. Root Directory Responsibilities

## docs/

Contains all project documentation.

Documentation is considered part of the source code and must evolve together with the platform.

Subdirectories include:

* handbook
* architecture decision records
* diagrams
* meeting notes

---

## prisma/

Contains:

* Prisma schema
* migrations
* seed scripts

No application logic belongs here.

---

## public/

Contains publicly accessible assets.

Examples:

* images
* fonts
* compiled JavaScript
* icons

---

## scripts/

Contains standalone scripts.

Examples:

* supplier imports
* maintenance
* data migration
* one-time utilities

Scripts should not contain business logic that belongs within application services.

---

## tests/

Contains automated tests.

Test structure should mirror the application structure wherever practical.

---

# 5. Source Structure

```text
src/

├── app.ts
├── server.ts
│
├── config/
│
├── infrastructure/
│
├── middleware/
│
├── modules/
│
├── shared/
│
├── types/
│
├── utils/
│
└── views/
```

---

# 6. Source Directory Responsibilities

## app.ts

Responsible for constructing the Express application.

Registers middleware, routing and application configuration.

Contains no business logic.

---

## server.ts

Application entry point.

Responsible only for starting the HTTP server.

---

## config/

Application configuration.

Examples:

* environment
* database
* sessions
* logging

Configuration should be centralised and strongly typed.

---

## infrastructure/

Contains implementations that communicate with external systems.

Examples:

* PostgreSQL
* Cloudinary
* Email providers
* Payment gateways
* Supplier connectors
* Search providers
* Cache providers

Infrastructure should remain replaceable.

---

## middleware/

Contains Express middleware.

Examples:

* authentication
* authorisation
* logging
* error handling
* security
* validation

Middleware should remain generic and reusable.

---

## modules/

Contains the business domains of PCS Core.

This directory represents the core of the platform.

Each business capability owns its own implementation.

---

## shared/

Contains reusable code shared across multiple modules.

Examples:

* constants
* custom errors
* helper functions
* pagination
* validation utilities
* logging utilities

Shared code must not contain business-specific behaviour.

---

## types/

Global TypeScript types.

Only truly global types belong here.

Business-specific types belong within their respective modules.

---

## utils/

Contains small utility functions.

Utilities should remain stateless and generic.

---

## views/

Contains shared EJS layouts and common view components.

Business-specific views should reside within their owning module where appropriate.

---

# 7. Business Module Structure

Each business domain follows an identical internal structure.

Example:

```text
modules/

    catalog/

        controllers/

        services/

        repositories/

        routes/

        validation/

        types/

        views/

        tests/

        index.ts
```

Every module is self-contained.

Modules should expose only their public interface.

Internal implementation details remain private.

---

# 8. Core Business Domains

PCS Core Version 1 includes the following domains.

```text
catalog
suppliers
inventory
customers
orders
checkout
authentication
administration
content
search
```

Additional domains may be introduced as the platform evolves.

---

# 9. Naming Conventions

Directories:

```
lowercase
```

Files:

```
kebab-case
```

Examples:

```
catalog.service.ts
catalog.controller.ts
catalog.repository.ts
catalog.routes.ts
catalog.validation.ts
```

Interfaces:

```
PascalCase
```

Examples:

```
Product
Supplier
Order
```

Classes:

```
PascalCase
```

Variables:

```
camelCase
```

Constants:

```
UPPER_SNAKE_CASE
```

---

# 10. Dependency Rules

The following dependency rules apply throughout PCS Core.

Presentation → Controllers

Controllers → Services

Services → Repositories

Repositories → Prisma

Prisma → PostgreSQL

Dependencies must never flow in the opposite direction.

---

# 11. Shared Code Guidelines

Before adding code to the Shared directory, developers should ask:

* Does more than one module require this?
* Is it independent of business logic?
* Can it remain generic?

If the answer to any question is "No", it should remain within the owning module.

---

# 12. Future Growth

The project structure is designed to support future expansion.

Examples include:

* additional suppliers
* additional sports
* background workers
* mobile APIs
* reporting
* analytics

New functionality should be introduced through additional modules rather than restructuring the existing platform.

---

# 13. Architectural Decisions Introduced

This chapter establishes the following architectural decisions:

| ADR     | Decision                                  |
| ------- | ----------------------------------------- |
| ADR-001 | Feature-based project structure           |
| ADR-002 | Business domains own their implementation |
| ADR-003 | Infrastructure remains replaceable        |
| ADR-004 | Shared code must remain generic           |
| ADR-005 | One responsibility per directory          |

---

# 14. Summary

PCS Core adopts a feature-based organisational structure centred around business capabilities rather than framework components.

This approach provides:

* improved maintainability
* easier navigation
* clearer ownership
* lower coupling
* better scalability

The project structure should evolve through the addition of new business domains rather than structural redesign.

Every directory, module and file should exist for a clearly defined architectural reason.

---

**End of Chapter 03**
