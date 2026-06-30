# PCS Core Database Architecture

# Schema Overview

---

**Document Version:** 1.0.0

**Document Status:** Approved

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Author:** Pro Court Sports Engineering

**Last Updated:** 2026-06-29

---

# Purpose

This document provides a high-level overview of the PCS Core database schema.

It maps each Aggregate Root to its corresponding Prisma models and PostgreSQL tables, serving as the bridge between the Domain Model and the implementation of the persistence layer.

Detailed model definitions are implemented in `prisma/schema.prisma`.

---

# Database Overview

The database is organised according to the Aggregate Roots defined within the Domain Model.

Each Aggregate Root owns a collection of related Prisma models and PostgreSQL tables.

This structure preserves the business boundaries established by the Domain-Driven Design architecture.

---

# AGR-001 — Commerce

| Domain Entity | Prisma Model | PostgreSQL Table |
|----------------|--------------|------------------|
| Store          | Store        | stores            |
| Currency       | Currency     | currencies |
| Tax Rate       | TaxRate      | tax_rates |
| Shipping Method| ShippingMethod | shipping_methods |
| Payment Method | PaymentMethod | payment_methods |

---

# AGR-002 — Catalog

| Domain Entity | Prisma Model | PostgreSQL Table |
|----------------|--------------|------------------|
| Sport          | Sport        | sports |
| Category       | Category     | categories |
| Brand          | Brand        | brands |
| Product        | Product      | products |
| Product Variant| ProductVariant | product_variants |
| Attribute      | Attribute    | attributes |
| Attribute Value| AttributeValue | attribute_values |
| Media          | Media        | media |

---

# AGR-003 — Supply Chain

| Domain Entity | Prisma Model | PostgreSQL Table |
|----------------|--------------|------------------|
| Supplier       | Supplier     | suppliers |
| Supplier Feed  | SupplierFeed | supplier_feeds |
| Import Job     | ImportJob    | import_jobs |
| Supplier Product | SupplierProduct | supplier_products |
| Warehouse      | Warehouse    | warehouses |
| Inventory      | Inventory    | inventory |
| Inventory Movement | InventoryMovement | inventory_movements |
| Price History  | PriceHistory | price_history |

---

# AGR-004 — Customers

| Domain Entity | Prisma Model | PostgreSQL Table |
|----------------|--------------|------------------|
| Customer       | Customer     | customers |
| Address        | Address      | addresses |
| Shopping Cart  | ShoppingCart | shopping_carts |
| Cart Item      | CartItem     | cart_items |
| Wishlist       | Wishlist     | wishlists |

---

# AGR-005 — Sales

| Domain Entity  | Prisma Model | PostgreSQL Table |
|----------------|--------------|------------------|
| Order          | Order        | orders |
| Order Item     | OrderItem    | order_items |
| Payment        | Payment      | payments |
| Shipment       | Shipment     | shipments |
| Refund         | Refund       | refunds |

---

# AGR-006 — Content

| Domain Entity | Prisma Model | PostgreSQL Table |
|----------------|--------------|------------------|
| Page           | Page         | pages |
| Hero           | Hero         | heroes |
| Banner         | Banner       | banners |
| Navigation     | Navigation   | navigation |
| SEO Metadata   | SeoMetadata  | seo_metadata |

---

# Shared Conventions

All Prisma models follow the standards defined in:

```text
docs/database/prisma-standards.md
```

Including:

- UUID primary keys
- UTC timestamps
- Explicit relationships
- Foreign key constraints
- Consistent naming conventions
- Prisma `@@map()` table mappings

---

# Implementation Order

The database schema will be implemented incrementally.

## Phase 1

Commerce

---

## Phase 2

Catalog

---

## Phase 3

Supply Chain

---

## Phase 4

Customers

---

## Phase 5

Sales

---

## Phase 6

Content

Each phase will include:

- Prisma models
- Relationships
- Constraints
- Indexes
- Initial migrations

before moving to the next Aggregate Root.

---

# Relationship to the Domain Model

The mapping between business and persistence is direct.

```text
Domain Entity

↓

Prisma Model

↓

PostgreSQL Table

↓

Repository

↓

Service

↓

REST API
```

No Prisma model may exist without a corresponding Domain Entity.

---

# Summary

This document provides the master overview of the PCS Core persistence layer.

It ensures that every Aggregate Root, Domain Entity, Prisma model and PostgreSQL table maintains a one-to-one relationship with the Domain Model, preserving architectural consistency throughout the implementation of PCS Core.

---

**End of Schema Overview**