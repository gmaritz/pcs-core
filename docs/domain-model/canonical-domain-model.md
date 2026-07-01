---
title: PCS Core Canonical Domain Model
version: 2.1.0
status: APPROVED
author: PCS Core Architecture
last-updated: 2026-06-30
---

# PCS Core Canonical Domain Model

---

# Purpose

The Canonical Domain Model defines the core business entities of PCS Core and the relationships between them.

It is the authoritative reference for:

- Domain Modelling
- Database Design
- Prisma Schema
- API Design
- Supplier Integration
- Business Rules

All implementation within PCS Core must conform to this document.

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

Each domain owns its own Aggregate Root.

---

# Commerce Domain

The Commerce Domain defines how the business operates.

Aggregate Root:

- Store

Entities:

- Store
- Currency
- Tax Rate
- Shipping Method
- Payment Method

---

# Catalog Domain

The Catalog Domain manages the canonical product catalogue.

It is divided into two logical areas.

## Catalog Master Data

```
Sport

Category

Brand

Specification Definition
```

These entities change infrequently and are managed by administrators.

---

## Catalogue

```
Product

Product Variant

Product Specification

Media
```

These entities represent the operational catalogue presented to customers.

---

# Catalog Hierarchy

```
Sport
│
├── Category
├── Brand
└── Specification Definition

Category
        │
        ▼
     Product
        │
Brand   │
   │    │
   └────┘
        │
        ▼
Product Variant
        │
        ▼
Product Specification

Product
        │
        ▼
Media
```

---

# Sport

Sport is the highest level of catalogue classification.

Examples:

- Tennis
- Padel
- Squash
- Pickleball
- Badminton

A Sport owns many Categories.

A Sport owns many Brands.

---

# Category

Categories classify products by type.

Examples:

- Racquets
- Shoes
- Strings
- Bags
- Balls
- Apparel

Every Category belongs to one Sport.

Products belong to one Category.

---

# Brand

Brands represent manufacturers.

Examples:

- Wilson
- HEAD
- Yonex
- Babolat
- Tecnifibre

Every Brand belongs to one Sport.

Products belong to one Brand.

A Brand may manufacture products across multiple Categories.

---

# Specification Definition

A Specification Definition defines a reusable product characteristic.

Examples include:

- Weight
- Balance
- Head Size
- Beam Width
- Material
- Flex Rating
- String Pattern

A Specification Definition describes **what** may be recorded.

It does not store values.

Each Specification Definition includes:

- Name
- Code
- Slug
- Data Type
- Unit
- Description

---

# Product

The Product is the Aggregate Root of the Catalog Domain.

It represents the canonical catalogue entry.

A Product references:

- Category
- Brand

The Sport is derived through the Category.

A Product owns:

- Product Variants
- Product Specifications
- Media

A Product does not own:

- Inventory
- Pricing
- Supplier Information

---

# Product Variant

A Product Variant represents a purchasable item.

Examples:

Wilson Blade 98 V9

- Grip Size 1
- Grip Size 2
- Grip Size 3
- Grip Size 4

Each Product Variant owns:

- SKU
- Barcode
- Pricing
- Inventory
- Supplier Mapping

Customers purchase Product Variants.

---

# Product Specification

A Product Specification stores the value of a Specification Definition for a Product.

Example:

| Product | Specification | Value |
|----------|---------------|------|
| Wilson Blade 98 | Weight | 305 |
| Wilson Blade 98 | Balance | 320 |
| Wilson Blade 98 | Head Size | 98 |

A Product may contain only one value for each Specification Definition.

---

# Media

Media belongs to Products.

Examples:

- Product Photography
- Lifestyle Images
- Videos
- Technical Diagrams

Media supports merchandising and customer engagement.

---

# Supply Chain Domain

Aggregate Root:

- Supplier

Entities:

- Supplier
- Supplier Feed
- Import Job
- Supplier Product
- Warehouse
- Inventory
- Inventory Movement
- Price History

Supplier Products reference Product Variants.

Inventory references Product Variants.

Price History references Product Variants.

---

# Customer Domain

Aggregate Root:

- Customer

Planned entities:

- Customer
- Address
- Shopping Cart
- Cart Item
- Wishlist

Customers purchase Product Variants.

---

# Sales Domain

Aggregate Root:

- Order

Planned entities:

- Order
- Order Item
- Shipment
- Payment
- Refund

Order Items reference Product Variants.

---

# Content Domain

Aggregate Root:

- Page

Planned entities:

- Page
- Navigation
- Banner
- SEO Metadata

Content references Products.

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

# Architectural Principles

PCS Core follows these principles.

- Store configures Commerce.
- Sport classifies Categories and Brands.
- Products reference Categories and Brands.
- Sport is derived from Category.
- Specification Definitions describe reusable product characteristics.
- Product Specifications store product values.
- Product Variants represent purchasable items.
- Suppliers reference Product Variants.
- Inventory references Product Variants.
- Orders reference Product Variants.
- Content references Products.

---

# Summary

The PCS Core Domain Model separates configuration, catalogue management, supplier integration and commerce into well-defined business domains.

The architecture is normalised, scalable and designed to support a multi-supplier ecommerce platform capable of expanding beyond racquet sports into all court sports.

---

# Revision History

| Version | Date | Description |
|----------|------------|-----------------------------------------------------------|
| 2.1.0 | 2026-06-30 | Finalised Catalog architecture. Introduced Specification Definition and Product Specification. Domain Model frozen for implementation. |
| 2.0.0 | 2026-06-30 | Revised Catalog hierarchy. |
| 1.0.0 | 2026-06-29 | Initial Domain Model. |