---
title: PCS Core Entity Catalogue
version: 2.0.0
status: Approved
author: PCS Core Architecture
last-updated: 2026-06-30
related-documents:
  - canonical-domain-model.md
  - aggregate-roots.md
---

# PCS Core Entity Catalogue

---

# Purpose

The Entity Catalogue provides a high-level inventory of every business entity within PCS Core.

Each entity has its own detailed specification within the Domain Model.

This document serves as the master index for all domain entities.

---

# Domain Overview

PCS Core is organised into six business domains.

```
Commerce

Catalog

Supply Chain

Customers

Sales

Content
```

Each domain owns its own Aggregate Root and business entities.

---

# Commerce Domain

The Commerce Domain configures how the business operates.

## Aggregate Root

- Store

## Entities

| Entity | ID | Purpose |
|---------|----|---------|
| Store | ENT-001 | Business configuration |
| Currency | ENT-002 | Supported currencies |
| Tax Rate | ENT-003 | Tax configuration |
| Shipping Method | ENT-004 | Shipping configuration |
| Payment Method | ENT-005 | Payment configuration |

Entity specifications:

```
entity-catalogue/
└── commerce/
    ├── ENT-001-store.md
    ├── ENT-002-currency.md
    ├── ENT-003-tax-rate.md
    ├── ENT-004-shipping-method.md
    └── ENT-005-payment-method.md
```

---

# Catalog Domain

The Catalog Domain manages the canonical product catalogue.

## Aggregate Root

- Product

## Classification Hierarchy

```
Sport
│
├── Category
│
├── Brand
│
└── Product
        │
        ├── Product Variant
        ├── Attribute
        ├── Attribute Value
        └── Media
```

Products reference:

- Category
- Brand

The Sport is derived through the Category.

## Entities

| Entity | ID | Purpose |
|---------|----|---------|
| Sport | ENT-100 | Highest-level catalogue classification |
| Category | ENT-101 | Product classification |
| Brand | ENT-102 | Product manufacturer |
| Product | ENT-103 | Canonical catalogue entity |
| Product Variant | ENT-104 | Purchasable product |
| Attribute | ENT-105 | Product specification type |
| Attribute Value | ENT-106 | Product specification value |
| Media | ENT-107 | Product media assets |

Entity specifications:

```
entity-catalogue/
└── catalog/
    ├── ENT-100-sport.md
    ├── ENT-101-category.md
    ├── ENT-102-brand.md
    ├── ENT-103-product.md
    ├── ENT-104-product-variant.md
    ├── ENT-105-attribute.md
    ├── ENT-106-attribute-value.md
    └── ENT-107-media.md
```

---

# Supply Chain Domain

The Supply Chain Domain manages supplier integrations and inventory.

## Aggregate Root

- Supplier

## Entities

| Entity | ID | Purpose |
|---------|----|---------|
| Supplier | ENT-200 | Supplier organisation |
| Supplier Feed | ENT-201 | Supplier data source |
| Import Job | ENT-202 | Import execution |
| Supplier Product | ENT-203 | Supplier product mapping |
| Warehouse | ENT-204 | Stock location |
| Inventory | ENT-205 | Stock quantity |
| Inventory Movement | ENT-206 | Inventory audit trail |
| Price History | ENT-207 | Historical pricing |

Entity specifications:

```
entity-catalogue/
└── supply-chain/
    ├── ENT-200-supplier.md
    ├── ENT-201-supplier-feed.md
    ├── ENT-202-import-job.md
    ├── ENT-203-supplier-product.md
    ├── ENT-204-warehouse.md
    ├── ENT-205-inventory.md
    ├── ENT-206-inventory-movement.md
    └── ENT-207-price-history.md
```

---

# Customer Domain

The Customer Domain manages customer information.

## Aggregate Root

- Customer

## Planned Entities

| Entity | ID |
|---------|----|
| Customer | ENT-300 |
| Address | ENT-301 |
| Shopping Cart | ENT-302 |
| Cart Item | ENT-303 |
| Wishlist | ENT-304 |

---

# Sales Domain

The Sales Domain manages commercial transactions.

## Aggregate Root

- Order

## Planned Entities

| Entity | ID |
|---------|----|
| Order | ENT-400 |
| Order Item | ENT-401 |
| Payment | ENT-402 |
| Shipment | ENT-403 |
| Refund | ENT-404 |

---

# Content Domain

The Content Domain manages merchandising and CMS functionality.

## Aggregate Root

- Page

## Planned Entities

| Entity | ID |
|---------|----|
| Page | ENT-500 |
| Navigation | ENT-501 |
| Banner | ENT-502 |
| SEO Metadata | ENT-503 |

---

# Aggregate Roots

PCS Core currently defines the following Aggregate Roots.

| Domain | Aggregate Root |
|----------|----------------|
| Commerce | Store |
| Catalog | Product |
| Supply Chain | Supplier |
| Customers | Customer |
| Sales | Order |
| Content | Page |

---

# Architectural Principles

The Entity Catalogue follows these principles.

- Every entity belongs to exactly one business domain.
- Every domain has one Aggregate Root.
- Every entity has a permanent entity identifier.
- Detailed specifications are maintained in individual entity documents.
- Relationships are defined in the Canonical Domain Model.
- Implementation follows the Entity Catalogue.

---

# Summary

The Entity Catalogue is the master index of every business entity within PCS Core.

It provides a stable reference for architecture, implementation, documentation and future expansion while delegating detailed business rules to the individual entity specifications.

---

# Revision History

| Version | Date | Description |
|----------|------------|-----------------------------------------------------------|
| 2.0.0 | 2026-06-30 | Updated Catalog hierarchy and converted Entity Catalogue into the master index for all entity specifications. |
| 1.0.0 | 2026-06-29 | Initial Entity Catalogue. |