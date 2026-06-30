# PCS Core Implementation Roadmap

---

**Project:** Pro Court Sports

**Project Codename:** PCS Core

**Document Version:** 1.0.0

**Document Status:** Living Document

**Last Updated:** 2026-06-29

---

# Overall Progress

```
Architecture      ████████████████████ 100%

Persistence       ██████░░░░░░░░░░░░░░ 30%

Backend           ░░░░░░░░░░░░░░░░░░░░ 0%

Frontend          ░░░░░░░░░░░░░░░░░░░░ 0%

Testing           ░░░░░░░░░░░░░░░░░░░░ 0%

Deployment        ░░░░░░░░░░░░░░░░░░░░ 0%
```

---

**Overall Project Progress**

**≈ 35% Complete**

---

**Current Version**

```
v0.5.0
```

**Current Milestone**

```
M06 — Commerce Aggregate
```

**Current Activity**

```
Catalog Aggregate

Overall Progress

≈ 40%
```

**Next Milestone**

```
M06 — Commerce Aggregate
```

---

# Purpose

This roadmap serves as the master implementation plan for PCS Core.

It tracks project progress from architecture through implementation, testing and production deployment.

Unlike the Architecture Handbook, which documents *how the platform is designed*, this roadmap documents *how the platform will be built*.

This document is updated continuously throughout the life of the project.

---

# Project Status

| Phase | Status |
|---------|:------:|
| Vision | ✅ Complete |
| Architecture | ✅ Complete |
| Domain Model | ✅ Complete |
| Database Architecture | ✅ Complete |
| Implementation | 🚧 In Progress |
| Testing | ⏳ Planned |
| Production | ⏳ Planned |

---

# Version Roadmap

| Version | Milestone | Status |
|-----------|-----------|:------:|
| v0.1.0 | Project Foundation | ✅ |
| v0.2.0 | Architecture Handbook | ✅ |
| v0.3.0 | Domain Model | ✅ |
| v0.4.0 | Database Architecture | ✅ |
| v0.5.0 | Prisma & Persistence Layer | ⏳ |
| v0.6.0 | Backend Core | ⏳ |
| v0.7.0 | Public REST API | ⏳ |
| v0.8.0 | Supplier Integrations | ⏳ |
| v0.9.0 | Ecommerce MVP | ⏳ |
| v1.0.0 | Production Release | ⏳ |

---

# Milestone Roadmap

---

## M01 — Project Foundation

**Status:** ✅ Complete

### Deliverables

- Repository created
- Project structure
- TypeScript
- Express
- EJS
- Prisma
- PostgreSQL
- Documentation structure
- Git repository

---

## M02 — Domain Model

**Status:** ✅ Complete

### Deliverables

- Domain Model
- Aggregate Roots
- Entity Catalogue
- Business Rules
- Mermaid diagrams
- Catalog Domain

---

## M03 — Supply Chain Domain

**Status:** ✅ Complete

### Deliverables

- Supplier
- Supplier Feed
- Import Job
- Supplier Product
- Warehouse
- Inventory
- Inventory Movement
- Price History
- Supply Chain diagrams
- Workflow diagrams

---

## M04 — Database Architecture

**Status:** ✅ Complete

### Deliverables

- Database Architecture
- Prisma Standards
- Schema Overview
- Persistence Strategy
- Handbook Chapter 6

---

## M05 — Prisma Foundation

**Status:** ⏳ Planned

### Deliverables

- schema.prisma
- Generator
- Datasource
- Base enums
- Naming conventions
- UUID strategy
- Timestamp strategy

---

## M06 — Commerce Aggregate

**Status:** ⏳ Planned

### Deliverables

- Store
- Currency
- Tax Rate
- Shipping Method
- Payment Method

---

## M07 — Catalog Models

**Status:** ⏳ Planned

### Deliverables

- Sport
- Category
- Brand
- Product
- Product Variant
- Attribute
- Attribute Value
- Media

---

## M08 — Supply Chain Models

**Status:** ⏳ Planned

### Deliverables

- Supplier
- Supplier Feed
- Import Job
- Supplier Product
- Warehouse
- Inventory
- Inventory Movement
- Price History

---

## M09 — Customer Models

**Status:** ⏳ Planned

### Deliverables

- Customer
- Address
- Shopping Cart
- Cart Item
- Wishlist

---

## M10 — Sales Models

**Status:** ⏳ Planned

### Deliverables

- Order
- Order Item
- Payment
- Shipment
- Refund

---

## M11 — Content Models

**Status:** ⏳ Planned

### Deliverables

- Page
- Hero
- Banner
- Navigation
- SEO Metadata

---

## M12 — Repository Layer

**Status:** ⏳ Planned

### Deliverables

- Repository interfaces
- Prisma repositories
- Base repository
- Transaction support

---

## M13 — Service Layer

**Status:** ⏳ Planned

### Deliverables

- Business services
- Validation
- Domain logic
- Unit testing

---

## M14 — Authentication & Security

**Status:** ⏳ Planned

### Deliverables

- Authentication
- Authorization
- Sessions
- Roles
- Permissions

---

## M15 — REST API

**Status:** ⏳ Planned

### Deliverables

- API architecture
- Controllers
- Routes
- Validation
- Error handling

---

## M16 — Admin Portal

**Status:** ⏳ Planned

### Deliverables

- Dashboard
- Product Management
- Supplier Management
- Inventory Management
- Customer Management

---

## M17 — Public Website

**Status:** ⏳ Planned

### Deliverables

- Homepage
- Product Catalogue
- Search
- Product Pages
- Shopping Cart

---

## M18 — Customer Portal

**Status:** ⏳ Planned

### Deliverables

- Registration
- Login
- Orders
- Wishlist
- Addresses

---

## M19 — Supplier Integrations

**Status:** ⏳ Planned

### Deliverables

- Supplier API Framework
- Synchronisation Engine
- Scheduling
- Monitoring

---

## M20 — Payments & Shipping

**Status:** ⏳ Planned

### Deliverables

- Payment Gateway
- Shipping Integration
- Tax Calculation

---

## M21 — Testing

**Status:** ⏳ Planned

### Deliverables

- Unit Testing
- Integration Testing
- End-to-End Testing
- Performance Testing

---

## M22 — Deployment

**Status:** ⏳ Planned

### Deliverables

- Production Deployment
- CI/CD
- Monitoring
- Backups
- Logging

---

# Guiding Principles

Every milestone follows the same engineering workflow.

```text
Architecture

↓

Documentation

↓

Domain Model

↓

Database

↓

Implementation

↓

Testing

↓

Git Commit

↓

Review

↓

Next Milestone
```

Implementation never precedes architecture.

---

# Success Criteria

PCS Core will be considered ready for production when:

- All milestones are complete.
- Documentation is current.
- All tests pass.
- Supplier integrations are operational.
- The platform supports end-to-end ecommerce transactions.
- Deployment and monitoring are in place.

---

# Notes

This roadmap is a living document and should be updated as milestones are completed, new requirements emerge, or project priorities evolve.

It serves as the single source of truth for implementation progress throughout the lifecycle of PCS Core.

---

**End of Implementation Roadmap**