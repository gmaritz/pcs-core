# PCS Core Domain Model

# Aggregate Roots

---

**Document Version:** 1.0.0

**Document Status:** Draft

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Author:** Pro Court Sports Engineering

**Related Handbook:** Chapter 04 — Domain Model & Database Architecture

**Related Documents:**

* canonical-domain-model.md
* entity-catalogue.md
* business-rules.md

**Related Diagrams:**

* aggregate-roots.mmd
* bounded-contexts.mmd

**Last Updated:** 2026-06-29

---

# 1. Purpose

This document defines the Aggregate Roots used throughout the PCS Core domain model.

Aggregate Roots establish the ownership boundaries of the business and define how entities relate to one another.

They ensure that business rules remain consistent and that every entity has a clearly defined owner.

Aggregate Roots are business concepts and must not be confused with database tables or implementation details.

---

# 2. Design Principles

PCS Core follows the following principles regarding Aggregate Roots.

## AR-001 — Every Entity Belongs to an Aggregate

Every business entity belongs to exactly one Aggregate Root.

---

## AR-002 — Aggregate Roots Control Consistency

Business rules are enforced through the Aggregate Root.

Child entities should not be modified independently if doing so would violate business rules.

---

## AR-003 — Aggregates Communicate Through References

Aggregate Roots reference one another rather than sharing ownership.

For example:

Order Items reference Product Variants.

Orders do not own Products.

---

## AR-004 — Aggregates Represent Business Boundaries

Aggregate boundaries reflect business responsibilities rather than technical implementation.

---

# 3. Aggregate Overview

| Aggregate Root | Domain       | Identifier |
| -------------- | ------------ | ---------- |
| Store          | Commerce     | AGR-001    |
| Product        | Catalog      | AGR-002    |
| Supplier       | Supply Chain | AGR-003    |
| Customer       | Customers    | AGR-004    |
| Order          | Sales        | AGR-005    |
| Page           | Content      | AGR-006    |

These six Aggregate Roots define the primary ownership boundaries of PCS Core.

---

# AGR-001 — Store

## Domain

Commerce (DOM-001)

### Purpose

Represents the Pro Court Sports platform configuration.

### Owns

* Store Settings
* Supported Currencies
* Tax Configuration
* Shipping Methods
* Payment Methods

### References

All other domains consume Store configuration.

### Business Invariants

* Only one active Store configuration exists.
* Store configuration is globally available.
* Configuration changes are audited.

---

# AGR-002 — Product

## Domain

Catalog (DOM-002)

### Purpose

Represents the canonical commercial identity of every product sold by Pro Court Sports.

### Owns

* Product Variants
* Product Attributes
* Attribute Values
* Media

### References

* Brand
* Category
* Sport
* Supplier Products
* Promotions

### Does NOT Own

* Inventory
* Supplier Pricing
* Warehouses
* Orders

### Business Invariants

* Every Product belongs to one Brand.
* Every Product belongs to one Sport.
* Every Product belongs to one Category.
* Products never own inventory.
* Products never own supplier pricing.
* Product Variants cannot exist without a Product.

---

# AGR-003 — Supplier

## Domain

Supply Chain (DOM-003)

### Purpose

Represents an external organisation supplying products to Pro Court Sports.

### Owns

* Supplier Products
* Supplier Feeds
* Import Jobs
* Supplier-specific Pricing
* Supplier Inventory

### References

* Product Variants
* Warehouses

### Does NOT Own

* Products
* Categories
* Brands

### Business Invariants

* Supplier Products always reference a Product Variant.
* Supplier inventory belongs to a Supplier.
* Supplier pricing belongs to Supplier Products.

---

# AGR-004 — Customer

## Domain

Customers (DOM-004)

### Purpose

Represents a registered customer of Pro Court Sports.

### Owns

* Addresses
* Shopping Cart
* Cart Items
* Wishlists

### References

* Orders

### Does NOT Own

* Orders
* Payments

### Business Invariants

* A Customer owns one active Shopping Cart.
* A Customer may have multiple Addresses.
* A Customer may have multiple Wishlists.

---

# AGR-005 — Order

## Domain

Sales (DOM-005)

### Purpose

Represents a completed commercial transaction.

### Owns

* Order Items
* Payments
* Shipments
* Refunds

### References

* Customer
* Product Variants

### Does NOT Own

* Products
* Inventory

### Business Invariants

* Orders become immutable after confirmation.
* Order Items reference Product Variants.
* Payments belong to Orders.
* Shipments belong to Orders.

---

# AGR-006 — Page

## Domain

Content (DOM-006)

### Purpose

Represents structured customer-facing content published by Pro Court Sports.

### Owns

* Hero Sections
* Banners
* Content Blocks
* SEO Metadata

### References

* Products
* Categories
* Brands

### Business Invariants

* Published pages maintain version history.
* Content changes are auditable.
* Pages remain independent of catalogue implementation.

---

# 4. Aggregate Relationships

The Aggregate Roots interact through references rather than ownership.

```text
Store
    │
    ├──────────────┐
    │              │
    ▼              ▼
Product      Supplier
    │              │
    └──────┬───────┘
           │
           ▼
        Customer
           │
           ▼
         Order
           │
           ▼
          Page
```

Ownership never crosses Aggregate boundaries.

---

# 5. Design Guidelines

When introducing a new entity, the following questions must always be answered:

1. Which Aggregate owns this entity?
2. Can the entity exist independently?
3. Which Aggregate references it?
4. Which business rules protect it?
5. Can it be modified directly?

If these questions cannot be answered, the entity is not yet sufficiently defined.

---

# 6. Relationship to Other Documents

This document defines ownership boundaries for the PCS Core business model.

It provides the foundation for:

* Entity Catalogue
* Business Rules
* Mermaid Domain Diagrams
* Entity Relationship Diagram
* Prisma Schema
* Service Layer Design

All future entities must belong to one of the Aggregate Roots defined in this document unless an Architecture Decision Record introduces a new Aggregate.

---

# 7. Summary

Aggregate Roots establish the ownership boundaries of the PCS Core platform.

By defining these boundaries before designing the database or writing application code, PCS Core ensures that business rules remain consistent, responsibilities remain clear, and future growth can occur without fundamental architectural redesign.

Aggregate Roots are therefore considered one of the foundational architectural concepts of PCS Core.

---

**End of Aggregate Roots**
