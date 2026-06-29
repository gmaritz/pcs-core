# Canonical Domain Model

This document captures the canonical domain model for PCS Core.

flowchart TD
    A[Domain Model] --> B[Business Domains]
    
# PCS Core Domain Model

# Canonical Domain Model

---

**Document Version:** 1.0.0

**Document Status:** Draft

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Author:** Pro Court Sports Engineering

**Related Handbook:** Chapter 04 — Domain Model & Database Architecture

**Related Diagrams**

* Business Domains
* Canonical Domain Model
* Aggregate Roots
* Entity Relationships
* Bounded Contexts

**Last Updated:** 2026-06-29

---

# 1. Purpose

The Canonical Domain Model defines the business concepts that make up the PCS Core commerce platform.

It intentionally describes the business independently of any implementation technology.

This document does not describe PostgreSQL tables, Prisma models, REST APIs or application code.

Instead, it defines the language, entities, domains and relationships that represent the business itself.

All implementation artefacts must remain consistent with this document.

---

# 2. Design Principles

The Canonical Domain Model follows the following principles.

## Business Before Technology

Business concepts are defined before implementation.

Technology exists to support the business—not to define it.

---

## Single Source of Truth

Each business concept is defined exactly once.

All subsequent documentation references this model.

---

## Stable Business Identity

Business entities represent real business concepts.

Their identity should remain stable even if implementation changes.

---

## Separation of Concerns

Each business domain owns its own concepts and responsibilities.

Domains communicate through clearly defined relationships rather than shared implementation.

---

## Long-Term Evolution

The model should support the long-term growth of Pro Court Sports without requiring fundamental redesign.

Future products, suppliers, sports and services should extend the model rather than replace it.

---

# 3. Business Domains

PCS Core is organised around six bounded business domains.

| Domain       | Responsibility                                       |
| ------------ | ---------------------------------------------------- |
| Commerce     | Platform-wide configuration and operational settings |
| Catalog      | Products and product information                     |
| Supply Chain | Suppliers, inventory and sourcing                    |
| Customers    | Customer information and shopping experience         |
| Sales        | Orders, payments and fulfilment                      |
| Content      | Marketing content and customer engagement            |

Each domain represents an independent business capability.

---

# 4. Canonical Business Model

The following diagram represents the high-level business structure of PCS Core.

```text
                        COMMERCE
                Store Configuration

                              │

                              ▼

CATALOG -------------------------------- SUPPLY CHAIN

Sport                          Supplier

Category                       Supplier Feed

Brand                          Supplier Product

Product                        Warehouse

Product Variant                Inventory

Attribute                      Price History

Attribute Value                Inventory Movement

Media                          Import Job



CUSTOMERS ---------------------------- SALES

Customer                       Order

Address                        Order Item

Wishlist                       Payment

Shopping Cart                  Shipment

Cart Item                      Refund



                    CONTENT

Page

Article

Banner

Hero

Navigation

FAQ
```

This diagram represents business concepts only.

It deliberately omits database implementation details.

---

# 5. Domain Responsibilities

## Commerce

Responsible for platform-wide operational configuration.

Examples include:

* Store configuration
* Supported currencies
* Tax configuration
* Shipping methods
* Payment methods

Commerce contains no customer-specific data.

---

## Catalog

Responsible for defining the products sold by Pro Court Sports.

The Catalog defines:

* Sports
* Categories
* Brands
* Products
* Product Variants
* Product Attributes
* Product Media

The Catalog does **not** manage inventory or supplier pricing.

---

## Supply Chain

Responsible for sourcing products from suppliers.

The Supply Chain owns:

* Suppliers
* Supplier catalogues
* Supplier pricing
* Supplier inventory
* Warehouses
* Inventory movements
* Supplier imports

Inventory always belongs to the Supply Chain.

---

## Customers

Responsible for customer identity and shopping activity.

The Customer domain manages:

* Customer profiles
* Addresses
* Shopping carts
* Wishlists

Customers do not own Orders.

Orders belong to the Sales domain.

---

## Sales

Responsible for commercial transactions.

Sales owns:

* Orders
* Order Items
* Payments
* Shipments
* Refunds

Orders become immutable after confirmation.

---

## Content

Responsible for customer communication and marketing.

Examples include:

* Articles
* Landing pages
* Homepage banners
* Navigation
* Frequently Asked Questions

Content should remain independent of the product catalogue wherever practical.

---

# 6. Cross-Domain Relationships

The following relationships exist between business domains.

```text
Catalog

↓

Supply Chain

↓

Sales

↓

Customers
```

Supporting domains:

```text
Commerce

Content
```

Commerce provides configuration to every domain.

Content supports customer engagement across the platform.

---

# 7. Architectural Constraints

The following constraints apply throughout PCS Core.

### DC-001

Products never own inventory.

---

### DC-002

Supplier Products own supplier pricing.

---

### DC-003

Inventory belongs to a supplier or warehouse.

---

### DC-004

Orders become immutable after confirmation.

---

### DC-005

Business domains remain independently maintainable.

---

### DC-006

Business concepts should remain independent of implementation technology.

---

# 8. Relationship to Other Documentation

The Canonical Domain Model serves as the foundation for:

* Aggregate Roots
* Entity Catalogue
* Business Rules
* UML Class Diagrams
* Entity Relationship Diagrams
* Prisma Schema
* API Design
* Service Design

No implementation document should contradict this model.

---

# 9. Future Evolution

The Canonical Domain Model is expected to evolve as Pro Court Sports expands.

Future enhancements should extend existing business concepts wherever possible rather than introducing unnecessary complexity.

Significant structural changes should be documented through an Architecture Decision Record (ADR).

---

# 10. Summary

The Canonical Domain Model defines the business architecture of PCS Core.

It provides a technology-independent description of the platform and serves as the authoritative reference for every subsequent architectural and implementation decision.

Every future database table, API endpoint, service, user interface and supplier integration should trace its origin back to the concepts defined within this document.

---

**End of Canonical Domain Model**


    A --> C[Entities]
    A --> D[Value Objects]
