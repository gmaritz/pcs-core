# PCS Core Architecture & Development Handbook

# Chapter 4 — Domain Model & Database Architecture

---

**Document Version:** 1.0.0

**Document Status:** Approved

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Author:** Pro Court Sports Engineering

**Last Updated:** 2026-06-29

---

# 1. Purpose

The Domain Model defines the business language of PCS Core.

Before designing a database, writing application code or implementing APIs, the business itself must first be modelled accurately. Every software component within PCS Core is derived from the Domain Model.

This chapter explains the architectural philosophy behind the Domain Model and how it forms the foundation for the persistence layer, business services and user interfaces.

---

# 2. Objectives

The Domain Model exists to:

- Capture business concepts independently of technology.
- Establish a ubiquitous language across the project.
- Define bounded contexts and aggregate boundaries.
- Model business entities and their relationships.
- Separate business concerns from implementation concerns.
- Provide the foundation for PostgreSQL, Prisma and the application code.

---

# 3. Architectural Principles

PCS Core follows Domain-Driven Design (DDD).

Business concepts are modelled before technical implementation.

The Domain Model:

- is independent of PostgreSQL
- is independent of Prisma
- is independent of TypeScript
- is independent of Express
- is independent of the user interface

Technology implements the business model—it never defines it.

---

# 4. Domain Architecture

PCS Core is organised into six bounded business domains.

| Domain | Responsibility |
|----------|----------------|
| DOM-001 | Commerce |
| DOM-002 | Catalog |
| DOM-003 | Supply Chain |
| DOM-004 | Customers |
| DOM-005 | Sales |
| DOM-006 | Content |

Each domain owns its own business concepts and responsibilities.

Communication between domains occurs through well-defined business relationships rather than tightly coupled implementations.

---

# 5. Aggregate Roots

Each domain contains one or more Aggregate Roots.

Aggregate Roots define ownership boundaries and transactional consistency.

Current Aggregate Roots include:

| Aggregate | Responsibility |
|------------|----------------|
| Store | Commerce configuration |
| Product | Product catalogue |
| Supplier | Supply Chain |
| Customer | Customer management |
| Order | Sales |
| Page | Content management |

Aggregate ownership is documented in:

```text
docs/domain-model/aggregate-roots.md
```

---

# 6. Entity Catalogue

Every business entity is documented individually.

The Entity Catalogue provides:

- business purpose
- ownership
- responsibilities
- business rules
- lifecycle
- relationships
- future considerations

Each entity has a permanent identifier.

Example:

```text
ENT-103 Product

ENT-203 Supplier Product

ENT-205 Inventory
```

The Entity Catalogue is located in:

```text
docs/domain-model/entity-catalogue/
```

---

# 7. Business Rules

Business Rules describe how entities behave.

Examples include:

- Product Variants belong to exactly one Product.
- Suppliers never own Products.
- Inventory represents current state only.
- Inventory Movement records historical changes.
- Price History is immutable.
- Import Jobs provide operational traceability.

Business Rules are documented independently of implementation.

---

# 8. Mermaid Diagrams

The Domain Model is supported by a comprehensive set of Mermaid diagrams.

Current diagrams include:

- Canonical Domain Model
- Aggregate Roots
- Business Domains
- Catalog Entity Relationships
- Supply Chain Entity Relationships
- Supply Chain Workflow

These diagrams provide a visual representation of the business architecture.

---

# 9. Relationship to the Database

The Domain Model is the authoritative source for database design.

The implementation flow is:

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

Repositories

↓

Services

↓

REST API

↓

User Interface
```

No database tables are designed independently of the Domain Model.

---

# 10. Relationship to Other Handbook Chapters

This chapter builds upon:

- Chapter 1 — Project Vision
- Chapter 2 — System Architecture
- Chapter 3 — Technology Stack

It provides the foundation for:

- Chapter 5 — Supply Chain Domain
- Chapter 6 — Data Architecture & Persistence
- All future implementation chapters.

---

# 11. Implementation Roadmap

The Domain Model is implemented in the following order:

1. Define business domains.
2. Identify aggregate roots.
3. Document entities.
4. Define business rules.
5. Create Mermaid diagrams.
6. Translate entities into Prisma models.
7. Generate PostgreSQL schema.
8. Implement repositories.
9. Implement business services.
10. Build APIs and user interfaces.

---

# 12. Key Design Principles

PCS Core adopts the following principles:

- Documentation First
- Domain-Driven Design
- Aggregate Ownership
- Persistence Independence
- Single Responsibility
- Separation of Concerns
- Immutable Historical Records
- Explicit Business Rules

These principles guide every architectural and implementation decision throughout the platform.

---

# 13. Summary

The Domain Model is the foundation of PCS Core.

Every business entity, database table, repository, service and API originates from the Domain Model. By separating business concepts from implementation technologies, PCS Core remains maintainable, extensible and adaptable as the platform evolves.

This architecture-first approach ensures that the software faithfully reflects the business rather than allowing implementation details to dictate business behaviour.

---

**End of Chapter 4**