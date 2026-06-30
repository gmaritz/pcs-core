# PCS Core Architecture & Development Handbook

# Chapter 6 — Data Architecture & Persistence

---

**Document Version:** 1.0.0

**Document Status:** Approved

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Author:** Pro Court Sports Engineering

**Last Updated:** 2026-06-29

---

# 1. Purpose

The Data Architecture defines how business concepts are persisted within PCS Core.

The Domain Model remains the authoritative representation of the business. The persistence layer is responsible for translating those business concepts into an efficient, reliable and scalable PostgreSQL database using Prisma ORM.

This chapter establishes the standards, conventions and architectural principles that govern all database design and persistence within PCS Core.

---

# 2. Objectives

The persistence layer exists to:

- Translate the Domain Model into a relational database.
- Preserve data integrity.
- Maintain transactional consistency.
- Optimise query performance.
- Support future scalability.
- Remain independent of business logic.
- Provide a clean abstraction through repositories.

---

# 3. Architectural Principles

The persistence layer follows these principles:

- Domain First
- Persistence Independence
- PostgreSQL as the source of persisted data
- Prisma as the persistence implementation
- Strong referential integrity
- Explicit relationships
- Immutable historical records
- Optimistic future scalability
- Documentation First

---

# 4. Technology Stack

PCS Core persistence consists of:

| Layer | Technology |
|---------|------------|
| Database | PostgreSQL |
| ORM | Prisma |
| Driver | pg |
| Migrations | Prisma Migrate |
| Query Builder | Prisma Client |
| Runtime | Node.js |
| Language | TypeScript |

---

# 5. Persistence Flow

The persistence architecture follows a strict translation process.

```text
Business Requirements

↓

Domain Model

↓

Entity Catalogue

↓

Business Rules

↓

Prisma Schema

↓

PostgreSQL Database

↓

Repository Layer

↓

Business Services

↓

REST API

↓

Presentation Layer
```

Business requirements always flow downward.

Implementation never dictates the business model.

---

# 6. Persistence Independence

The Domain Model must never depend upon Prisma.

Instead:

- Business entities define persistence.
- Prisma implements persistence.
- PostgreSQL stores persistence.

This separation ensures that future technology changes do not affect the business architecture.

---

# 7. Database Design Principles

PCS Core adopts the following database principles:

- Third Normal Form (3NF)
- Explicit foreign keys
- UUID primary keys
- Immutable audit history
- Soft deletes only where appropriate
- Timestamp auditing
- Consistent naming conventions
- Indexed foreign keys
- Transactional consistency

---

# 8. Repository Pattern

Application code never communicates directly with Prisma.

Instead:

```text
Controller

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

Repositories encapsulate all persistence logic.

Business services remain persistence-agnostic.

---

# 9. Transactions

Database transactions are used whenever multiple business entities must remain consistent.

Examples include:

- Customer checkout
- Order creation
- Inventory allocation
- Supplier synchronisation
- Warehouse transfers
- Price updates

Atomicity is required to preserve business integrity.

---

# 10. Audit Strategy

PCS Core distinguishes between mutable state and immutable history.

Examples:

| Current State | Historical Record |
|---------------|-------------------|
| Inventory | Inventory Movement |
| Supplier Product | Price History |
| Order | Order Status History *(future)* |
| Customer | Customer Activity *(future)* |

Historical entities are append-only and never modified.

---

# 11. Migration Strategy

All schema changes are managed through Prisma Migrate.

Rules:

- Never modify production schemas manually.
- Every structural change requires a migration.
- Migrations are committed to Git.
- Development and production remain synchronised through versioned migrations.

---

# 12. Future Scalability

The persistence architecture has been designed to support future growth including:

- Additional suppliers
- Millions of products
- Multiple warehouses
- High transaction volumes
- Horizontal application scaling
- Read replicas
- Background processing
- Analytics workloads
- Business intelligence

No fundamental redesign should be required.

---

# 13. Relationship to Other Chapters

This chapter implements the architecture defined in:

- Chapter 4 — Domain Model & Database Architecture
- Chapter 5 — Supply Chain Domain

It provides the foundation for:

- Prisma Schema
- PostgreSQL Database
- Repository Layer
- Service Layer
- REST API
- Future integrations

---

# 14. Summary

The persistence layer is the implementation of the Domain Model, not its definition.

By maintaining a strict separation between business concepts and persistence technologies, PCS Core achieves a robust, maintainable and scalable architecture capable of supporting enterprise-grade multi-supplier commerce.

Every database table, Prisma model, repository and migration originates from the Domain Model, ensuring that the software faithfully reflects the business it serves.

---

**End of Chapter 6**