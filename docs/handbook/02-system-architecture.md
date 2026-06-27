# PCS Core Architecture & Development Handbook

## Chapter 02 — System Architecture

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

This chapter defines the overall architecture of PCS Core.

It establishes how the platform is structured, how individual components interact, and the architectural rules that govern future development.

Every implementation within PCS Core must conform to the architecture described in this document unless an Architecture Decision Record (ADR) explicitly documents an approved deviation.

---

# 2. Architectural Philosophy

PCS Core is designed as a modular commerce platform rather than a traditional website.

The architecture prioritises:

* Separation of concerns
* High cohesion
* Low coupling
* Scalability
* Maintainability
* Testability
* Replaceable infrastructure

The platform is organised around business capabilities instead of framework components.

---

# 3. Architectural Layers

PCS Core follows a layered architecture.

Each layer has a clearly defined responsibility.

No layer may bypass another layer without documented justification.

```text
┌────────────────────────────────────────────┐
│          Presentation Layer                │
│      EJS • Tailwind • Client Scripts       │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│             Routing Layer                  │
│             Express Routes                 │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│           Controller Layer                 │
│   Request / Response Coordination          │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│             Service Layer                  │
│        Business Logic & Rules              │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│          Repository Layer                  │
│        Prisma Data Access                  │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│           PostgreSQL Database              │
└────────────────────────────────────────────┘
```

---

# 4. Layer Responsibilities

## 4.1 Presentation Layer

Responsible for:

* Rendering HTML
* Displaying data
* User interaction
* Client-side enhancements

The Presentation Layer must never contain business logic.

---

## 4.2 Routing Layer

Responsible for:

* URL definitions
* Route registration
* Middleware execution
* Controller delegation

Routes should remain lightweight.

---

## 4.3 Controller Layer

Responsible for:

* Receiving requests
* Validating input
* Calling services
* Returning responses

Controllers coordinate work.

They do not implement business rules.

---

## 4.4 Service Layer

The Service Layer is the heart of PCS Core.

Responsibilities include:

* Business logic
* Validation
* Pricing rules
* Inventory decisions
* Supplier selection
* Order processing

All business rules belong here.

---

## 4.5 Repository Layer

Responsible for:

* Database access
* Prisma queries
* Data persistence
* Transaction management

Repositories must not contain business logic.

---

## 4.6 Database Layer

PostgreSQL serves as the system of record.

All persistent business data is stored within PostgreSQL and accessed exclusively through Prisma repositories.

---

# 5. Business Domain Architecture

PCS Core is organised around business domains.

Each domain represents an independent business capability.

Initial domains include:

```text
Catalog
Suppliers
Inventory
Customers
Orders
Checkout
Authentication
Administration
Search
Content
```

Each domain owns:

* controllers
* services
* repositories
* routes
* types
* validation
* tests

This structure promotes modularity and allows domains to evolve independently.

---

# 6. Dependency Flow

Dependencies must always flow downward.

```text
Presentation
    ↓
Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Prisma
    ↓
PostgreSQL
```

Reverse dependencies are prohibited.

---

# 7. Communication Between Modules

Business domains communicate through clearly defined public interfaces.

Modules must never access another module's internal implementation directly.

This reduces coupling and simplifies future refactoring.

---

# 8. Architectural Rules

The following rules apply throughout PCS Core.

### Rule 1

Business logic belongs exclusively within Services.

---

### Rule 2

Repositories perform data access only.

---

### Rule 3

Views never contain business logic.

---

### Rule 4

Controllers remain thin.

---

### Rule 5

Database access occurs exclusively through repositories.

---

### Rule 6

Modules remain independent wherever practical.

---

### Rule 7

Every architectural decision should favour maintainability over short-term convenience.

---

# 9. Scalability Strategy

PCS Core is designed to support future growth without architectural redesign.

The architecture should comfortably accommodate:

* additional suppliers
* additional sports
* increased product catalogue size
* higher customer volumes
* background processing
* additional developers

Scalability should be achieved through modular expansion rather than structural replacement.

---

# 10. Extensibility

Infrastructure components should remain replaceable.

Examples include:

* payment gateways
* supplier integrations
* search engines
* email providers
* storage providers

Replacing one implementation should have minimal impact on the remainder of the platform.

---

# 11. Error Handling Strategy

Errors should be handled at the appropriate architectural layer.

Business validation errors should originate within Services.

Infrastructure failures should be handled within Repositories or Infrastructure components.

User-facing messages should remain clear, consistent and secure.

---

# 12. Logging Strategy

Logging should provide operational insight without exposing sensitive information.

Logging categories include:

* HTTP requests
* Authentication
* Supplier synchronisation
* Order processing
* Background jobs
* System errors

Sensitive information must never be written to application logs.

---

# 13. Future Evolution

This architecture is intended to evolve.

Significant architectural changes must be:

1. Proposed
2. Documented
3. Reviewed
4. Approved
5. Implemented

Major architectural changes should always be accompanied by an Architecture Decision Record (ADR).

---

# 14. Summary

PCS Core is built upon a layered, modular architecture that separates business concerns from infrastructure concerns.

The architecture prioritises simplicity, scalability and maintainability while allowing the platform to evolve through independent business domains.

Every future implementation should strengthen—not weaken—the architectural principles defined within this chapter.

---

**End of Chapter 02**
