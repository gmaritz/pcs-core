---
title: PCS Core Canonical Domain Model
version: 2.0.0
status: Approved
author: PCS Core Architecture
last-updated: 2026-06-30
related-documents:
  - entity-catalogue.md
  - aggregate-roots.md
  - business-rules.md
  - product-architecture-review.md
  - variant-attribute-strategy.md
---

# PCS Core Canonical Domain Model

---

# Purpose

The Canonical Domain Model defines the core business entities of PCS Core and the relationships between them.

It serves as the single source of truth for:

- Domain modelling
- Database design
- Prisma implementation
- API design
- Supplier integrations
- Business rules

Every implementation within PCS Core must conform to this document.

---

# Domain Overview

PCS Core is organised into six primary business domains.

```
Commerce

Catalog

Supply Chain

Customers

Sales

Content
```

Each domain owns its own Aggregate Roots and business responsibilities.

---

# Commerce Domain

The Commerce Domain configures how the business operates.

It contains:

- Store
- Currency
- Tax Rate
- Shipping Method
- Payment Method

The Store is the Aggregate Root.

---

# Catalog Domain

The Catalog Domain represents the products offered by Pro Court Sports.

It provides a canonical product catalogue shared by supplier integrations, inventory management, ecommerce, search and content management.

The Catalog Domain separates product classification from product identity.

---

# Catalog Hierarchy

```
Sport
│
├── Category
│       │
│       ▼
│    Product
│
├── Brand
│       │
│       ▼
│    Product
│
└──────────────────────────────

Product
        │
        ▼
Product Variant
        │
        ├── Attribute
        ├── Attribute Value
        └── Media
```

---

# Classification Model

The Catalog Domain uses three independent classification entities.

## Sport

Represents the highest level of catalogue organisation.

Examples include:

- Tennis
- Padel
- Squash
- Pickleball
- Badminton

A Sport owns many Categories.

A Sport owns many Brands.

---

## Category

Represents the product type.

Examples include:

- Racquets
- Shoes
- Balls
- Strings
- Bags
- Apparel
- Accessories

Every Category belongs to one Sport.

Products belong to one Category.

Categories classify products by function.

---

## Brand

Represents the manufacturer.

Examples include:

- Wilson
- HEAD
- Babolat
- Yonex
- Tecnifibre
- Dunlop

Every Brand belongs to one Sport.

Products belong to one Brand.

A Brand may produce products across many Categories.

---

# Product

The Product represents the canonical catalogue entry.

Examples:

- Wilson Blade 98 V9
- HEAD Speed Pro
- Babolat Pure Aero

A Product references:

- Category
- Brand

The Sport is derived through the Category.

The Product is the Aggregate Root of the Catalog Domain.

A Product owns:

- Product Variants
- Attributes
- Attribute Values
- Media

A Product does not own inventory.

A Product does not own supplier information.

A Product does not own pricing.

---

# Product Variant

A Product Variant represents the purchasable item.

Examples:

Wilson Blade 98 V9

- Grip Size 1
- Grip Size 2
- Grip Size 3
- Grip Size 4

Every Product Variant has its own:

- SKU
- Barcode
- Supplier mappings
- Inventory
- Pricing
- Cost price

Customers purchase Product Variants.

---

# Attributes

Attributes describe Products.

Examples:

- Weight
- Balance
- Head Size
- Beam Width
- Material
- Flex Rating
- String Pattern

Attributes support:

- Product pages
- Search
- Filtering
- Product comparisons
- Buying guides

Attributes never create inventory.

---

# Media

Media belongs to Products.

Examples include:

- Product photography
- Lifestyle photography
- Technical diagrams
- Marketing videos

Variant-specific media may be supported in future without changing the overall architecture.

---

# Supply Chain Domain

The Supply Chain Domain manages supplier integrations.

It contains:

- Supplier
- Supplier Feed
- Import Job
- Supplier Product
- Warehouse
- Inventory
- Inventory Movement
- Price History

Supplier Product references Product Variant.

Inventory references Product Variant.

Price History references Product Variant.

---

# Customer Domain

The Customer Domain manages customer information.

It contains:

- Customer
- Address
- Wishlist
- Shopping Cart
- Cart Item

Customers place Orders.

Customers add Product Variants to their carts.

---

# Sales Domain

The Sales Domain manages commercial transactions.

It contains:

- Order
- Order Item
- Shipment
- Payment
- Refund

Order Items reference Product Variants.

---

# Content Domain

The Content Domain manages merchandising.

It contains:

- Pages
- Navigation
- Banners
- SEO
- Marketing Content

Content references Products rather than Product Variants.

---

# Aggregate Roots

The Aggregate Roots of PCS Core are:

- Store
- Product
- Supplier
- Customer
- Order
- Page

Each Aggregate Root enforces the business rules for its own domain.

---

# Architectural Principles

The Canonical Domain Model follows these principles.

- Store configures Commerce.
- Sport classifies Categories and Brands.
- Categories classify products.
- Brands identify manufacturers.
- Products reference Categories and Brands.
- Sport is derived from the Category.
- Products are catalogue entities.
- Product Variants are purchasable entities.
- Suppliers reference Product Variants.
- Inventory references Product Variants.
- Orders reference Product Variants.
- Content references Products.
- Attributes describe Products.
- Media belongs to Products.

---

# Summary

The PCS Core Canonical Domain Model separates business configuration, catalogue management, supplier integration and commerce into well-defined business domains.

This architecture minimises data duplication, supports multi-supplier ecommerce and provides a scalable foundation for future sports, suppliers, products and sales channels.

---

# Revision History

| Version | Date | Description |
|----------|------------|-----------------------------------------------------------|
| 2.0.0 | 2026-06-30 | Revised Catalog architecture. Brands and Categories are independent Sport classifications. Products reference Category and Brand. Sport is derived from Category. |
| 1.0.0 | 2026-06-29 | Initial Canonical Domain Model. |