# PCS Core Module Dependency Map

Version: 1.0

Status: MVP Feature Development Complete

Last Updated: July 2026

Author: ChatGPT

---

# Purpose

This document defines the dependency relationships between all major PCS Core modules.

It establishes the architectural boundaries of the system and specifies the permitted direction of dependencies.

The objective is to ensure the platform remains modular, maintainable and scalable as new functionality is introduced.

---

# Architectural Principle

Dependencies always point towards the business domain and persistence layer.

Presentation modules never own business logic.

Business modules never depend on presentation modules.

Persistence never depends on higher layers.

```
Presentation

↓

Application

↓

Business

↓

Persistence

↓

Database
```

---

# Platform Overview

```
                         PCS Core

                              │

        ┌─────────────────────┴─────────────────────┐

        │                                           │

 Presentation Platform                     Business Platform

        │                                           │

 Shared Presentation Services             Shared Business Services

        │                                           │

                └──────────────┬──────────────┘

                               │

                     Persistence Platform

                               │

                           PostgreSQL
```

---

# Module Categories

## Presentation Modules

These modules render the customer experience.

- Storefront
- Homepage
- Catalogue
- Product Detail
- Shopping
- Authentication Views

---

## Business Modules

These modules implement business capabilities.

- Authentication
- Authorization
- Products
- Categories
- Brands
- Sports
- Pricing
- Inventory
- Suppliers
- Orders
- Customers
- Search
- Checkout

---

## Shared Services

Reusable cross-cutting capabilities.

- MediaService
- RecommendationService
- NotificationService
- PageMetadataService
- StorefrontPresentationService

---

## Infrastructure

- Prisma ORM
- PostgreSQL
- Express
- TypeScript

---

# Dependency Map

```
                    Storefront

                         │

      ┌──────────────────┼───────────────────┐

      │                  │                   │

 StorefrontFacade   CatalogFacade     ProductFacade

                                             │

                                      ShoppingFacade

                         │

                         ▼

                 Shared Services

      ┌──────────────┬──────────────┬──────────────┐

      │              │              │              │

 MediaService  MetadataService Recommendation Notification

                         │

                         ▼

                 Business Modules

      ┌──────────────┬──────────────┬──────────────┐

 Authentication

 Authorization

 Catalog

 Products

 Categories

 Brands

 Sports

 Pricing

 Inventory

 Orders

 Customers

 Search

 Checkout

 Suppliers

                         │

                         ▼

                     Prisma ORM

                         │

                         ▼

                    PostgreSQL
```

---

# Storefront Dependencies

Storefront depends upon

- StorefrontFacade
- CatalogFacade
- ProductFacade
- ShoppingFacade

Storefront must never access

- Prisma
- PostgreSQL

directly.

---

# Facade Dependencies

Facades may depend upon

- Shared Services
- Business Modules

Facades must never depend upon

- Views
- Controllers
- Prisma

---

# Shared Service Dependencies

Shared Services may depend upon

Business Modules where appropriate.

Presentation-oriented services must remain independent of persistence.

Shared Services must never depend upon

Views

Controllers

---

# Business Module Dependencies

Business Modules may depend upon

- Prisma
- Shared utility libraries
- Domain contracts

Business Modules must never depend upon

- EJS
- Controllers
- Views
- Facades

---

# Persistence Dependencies

Prisma

↓

PostgreSQL

Persistence never depends upon business logic or presentation.

---

# Dependency Rules

## Allowed

```
Controller

↓

Facade

↓

Shared Service

↓

Business Module

↓

Prisma

↓

PostgreSQL
```

---

## Forbidden

Presentation

↓

Database

❌

---

Views

↓

Prisma

❌

---

Controllers

↓

Prisma

❌

---

Business Modules

↓

Views

❌

---

Prisma

↓

Presentation

❌

---

# Current Module Inventory

## Presentation

- Storefront
- Homepage
- Catalogue
- Product Detail
- Shopping

---

## Facades

- StorefrontFacade
- CatalogFacade
- ProductFacade
- ShoppingFacade

---

## Shared Services

- StorefrontPresentationService
- MediaService
- PageMetadataService
- RecommendationService
- NotificationService

---

## Business Modules

Identity

- Authentication
- Authorization
- Users
- Roles
- Permissions

Commerce

- Products
- Categories
- Brands
- Sports
- Product Variants
- Inventory
- Pricing
- Orders
- Customers

Supplier Platform

- Suppliers
- Import Framework
- Adapter Framework
- Inventory Synchronisation
- Price Synchronisation

Commerce Services

- Cart
- Checkout
- Search

---

# Shared Service Usage Matrix

| Module | Media | Metadata | Recommendation | Notification | Presentation |
|---------|:-----:|:--------:|:--------------:|:------------:|:------------:|
| Homepage | ✅ | ✅ | ❌ | ❌ | ✅ |
| Catalogue | ✅ | ✅ | ❌ | ❌ | ✅ |
| Product Detail | ✅ | ✅ | ✅ | ❌ | ✅ |
| Shopping | ✅ | ✅ | ❌ | ✅ | ✅ |
| Administration *(Future)* | ✅ | ⏳ | ⏳ | ⏳ | ⏳ |

---

# Future Modules

The architecture reserves space for the following modules.

Administration

- Dashboard
- User Management
- Supplier Management
- Reports
- Settings

Marketing

- Promotions
- Campaigns
- SEO
- Landing Pages

Content

- CMS
- Static Pages
- Blog

Reporting

- Sales
- Inventory
- Supplier Performance

Analytics

- Customer Behaviour
- Search Analytics
- Conversion Metrics

Integrations

- Payment Providers
- Courier Services
- Email Providers
- ERP
- CRM

---

# Architecture Constraints

The following rules are mandatory.

Controllers remain lightweight.

Business logic belongs to Business Modules.

Presentation logic belongs to View Models.

Shared Services prevent duplicated implementation.

Facades coordinate workflows.

Prisma is accessed only by Business Modules.

Dependencies always point towards Persistence.

No circular dependencies are permitted.

---

# Architecture Health

Current Assessment

Presentation Isolation

✅ Excellent

Business Separation

✅ Excellent

Persistence Isolation

✅ Excellent

Shared Services

✅ Excellent

Facade Architecture

✅ Excellent

Extensibility

✅ Excellent

Maintainability

✅ Excellent

---

# Future Evolution

Future enhancements should introduce new modules by extending the existing dependency hierarchy.

Existing dependency directions must not be violated.

If new shared functionality is required, it should first be evaluated as a Shared Service before introducing additional module coupling.

---

# Conclusion

The PCS Core dependency structure establishes a clear separation between Presentation, Business and Persistence.

The dependency hierarchy is one of the platform's core architectural strengths.

Maintaining these dependency rules will ensure PCS Core remains scalable, maintainable and supplier-ready as the platform evolves beyond MVP.

---

# End Document