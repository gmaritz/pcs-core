---
title: PCS Core Entity Catalogue
version: 2.1.0
status: APPROVED
author: PCS Core Architecture
last-updated: 2026-06-30
related-documents:
  - canonical-domain-model.md
---

# PCS Core Entity Catalogue

---

# Purpose

The Entity Catalogue provides the definitive inventory of every business entity within PCS Core.

It serves as the master index for the Domain Model and provides a high-level overview of each business domain.

Detailed business rules for each entity are maintained in their individual entity specification documents.

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

Each domain owns a single Aggregate Root.

---

# Commerce Domain

## Aggregate Root

Store

## Purpose

The Commerce Domain configures how the ecommerce platform operates.

## Entities

| ID | Entity | Purpose |
|----|--------|---------|
| ENT-001 | Store | Business configuration |
| ENT-002 | Currency | Supported currencies |
| ENT-003 | Tax Rate | Tax configuration |
| ENT-004 | Shipping Method | Shipping configuration |
| ENT-005 | Payment Method | Payment configuration |

---

# Catalog Domain

The Catalog Domain is divided into two logical areas.

---

## Catalog Master Data

Master Data changes infrequently and is reused throughout the catalogue.

### Entities

| ID | Entity | Purpose |
|----|--------|---------|
| ENT-100 | Sport | Highest catalogue classification |
| ENT-101 | Category | Product classification |
| ENT-102 | Brand | Product manufacturer |
| ENT-105 | Specification Definition | Reusable product characteristic |

---

## Catalogue

The operational catalogue contains products and their associated commercial information.

### Aggregate Root

Product

### Entities

| ID | Entity | Purpose |
|----|--------|---------|
| ENT-103 | Product | Canonical catalogue entry |
| ENT-104 | Product Variant | Purchasable product |
| ENT-106 | Product Specification | Product value for a Specification Definition |
| ENT-107 | Media | Product media assets |

---

# Supply Chain Domain

## Aggregate Root

Supplier

## Purpose

Manages supplier integrations, inventory and pricing history.

## Entities

| ID | Entity | Purpose |
|----|--------|---------|
| ENT-200 | Supplier | Supplier organisation |
| ENT-201 | Supplier Feed | Supplier data source |
| ENT-202 | Import Job | Feed execution |
| ENT-203 | Supplier Product | Supplier-to-variant mapping |
| ENT-204 | Warehouse | Inventory location |
| ENT-205 | Inventory | Current stock |
| ENT-206 | Inventory Movement | Stock audit trail |
| ENT-207 | Price History | Historical pricing |

---

# Customer Domain

## Aggregate Root

Customer

## Planned Entities

| ID | Entity |
|----|--------|
| ENT-300 | Customer |
| ENT-301 | Address |
| ENT-302 | Shopping Cart |
| ENT-303 | Cart Item |
| ENT-304 | Wishlist |

---

# Sales Domain

## Aggregate Root

Order

## Planned Entities

| ID | Entity |
|----|--------|
| ENT-400 | Order |
| ENT-401 | Order Item |
| ENT-402 | Payment |
| ENT-403 | Shipment |
| ENT-404 | Refund |

---

# Content Domain

## Aggregate Root

Page

## Planned Entities

| ID | Entity |
|----|--------|
| ENT-500 | Page |
| ENT-501 | Navigation |
| ENT-502 | Banner |
| ENT-503 | SEO Metadata |

---

# Aggregate Roots

PCS Core defines the following Aggregate Roots.

| Domain | Aggregate Root |
|---------|----------------|
| Commerce | Store |
| Catalog | Product |
| Supply Chain | Supplier |
| Customers | Customer |
| Sales | Order |
| Content | Page |

---

# Entity Naming Conventions

To ensure consistency across the platform, the following naming conventions are adopted.

### Documentation

Documentation uses business terminology.

Examples:

- Specification Definition
- Product Specification

### Implementation

The Prisma models use concise implementation names.

| Documentation | Prisma Model |
|---------------|--------------|
| Specification Definition | Specification |
| Product Specification | ProductSpecification |

This provides clear documentation while keeping the implementation concise.

---

# Architectural Principles

The Entity Catalogue follows these principles.

- Every entity belongs to exactly one business domain.
- Every domain has one Aggregate Root.
- Master Data is reusable across the platform.
- Catalogue entities represent customer-facing information.
- Commercial data belongs to Product Variants.
- Product Specifications reference reusable Specification Definitions.
- Relationships are defined by the Canonical Domain Model.
- Prisma implementation follows this catalogue.

---

# Summary

The Entity Catalogue is the authoritative index of all business entities within PCS Core.

It provides a stable architectural reference for implementation while maintaining a clear separation between Master Data, Catalogue data and operational business domains.

---

# Revision History

| Version | Date | Description |
|----------|------------|-----------------------------------------------------------|
| 2.1.0 | 2026-06-30 | Finalised Catalog terminology. Introduced Specification Definition and Product Specification. |
| 2.0.0 | 2026-06-30 | Updated Catalog hierarchy. |
| 1.0.0 | 2026-06-29 | Initial Entity Catalogue. |