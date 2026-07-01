---
title: Product Architecture Review
version: 2.1.0
status: APPROVED
author: PCS Core Architecture
last-updated: 2026-06-30
related-documents:
  - canonical-domain-model.md
  - entity-catalogue.md
  - variant-attribute-strategy.md
---

# Product Architecture Review

---

# Purpose

This document defines the responsibilities of the Product Aggregate within PCS Core.

It explains how Products, Product Variants, Product Specifications and Specification Definitions work together to create a scalable catalogue architecture suitable for a multi-supplier ecommerce platform.

---

# Product Philosophy

PCS Core deliberately separates catalogue information from commercial information.

Customers browse Products.

Customers purchase Product Variants.

Suppliers supply Product Variants.

Inventory tracks Product Variants.

Pricing belongs to Product Variants.

This separation keeps catalogue information stable while allowing commercial information to evolve independently.

---

# Product Classification

Every Product is classified using two independent business dimensions.

```
Sport
│
├── Category
│
└── Brand
        │
        ▼
     Product
```

A Product references:

- Category
- Brand

The Sport is derived through the Category.

This avoids redundant relationships while ensuring every Product belongs to a single Sport.

---

# Aggregate Structure

```
Product
│
├── Product Variant
├── Product Specification
└── Media

Specification Definition
        │
        ▼
Product Specification
```

The Product is the Aggregate Root.

Specification Definitions are reusable Master Data and are not owned by the Product Aggregate.

---

# Product Responsibilities

A Product owns all information shared across every purchasable variation.

Examples include:

- Product Name
- URL Slug
- Category
- Brand
- Marketing Description
- Short Description
- Featured Status
- Product Specifications
- Product Media

A Product does not own:

- SKU
- Barcode
- Supplier SKU
- Inventory
- Cost Price
- Selling Price
- Warehouse Stock

These belong to the Product Variant.

---

# Product Variant Responsibilities

A Product Variant represents one purchasable item.

Examples:

Wilson Blade 98 V9

- Grip Size 1
- Grip Size 2
- Grip Size 3
- Grip Size 4

Each Product Variant owns:

- SKU
- Barcode
- Cost Price
- Selling Price
- Inventory
- Supplier Mapping
- Commercial Status

Each Product Variant may be stocked independently.

---

# Specification Definitions

Specification Definitions are reusable master data.

Examples:

- Weight
- Balance
- Head Size
- Beam Width
- Material
- String Pattern

Each Specification Definition defines:

- Name
- Code
- Slug
- Data Type
- Unit
- Description

Specification Definitions define what may be recorded.

They never contain product-specific values.

---

# Product Specifications

Product Specifications connect a Product with a Specification Definition.

Example:

| Product | Specification | Value |
|----------|---------------|------|
| Wilson Blade 98 | Weight | 305 |
| Wilson Blade 98 | Balance | 320 |
| Wilson Blade 98 | Head Size | 98 |

Each Product may contain only one value for a given Specification Definition.

---

# Supplier Integration

Supplier integrations reference Product Variants.

```
Supplier

        │

        ▼

Supplier Product

        │

        ▼

Product Variant
```

This enables multiple suppliers to provide the same Product while maintaining a single canonical catalogue entry.

---

# Inventory Strategy

Inventory belongs exclusively to Product Variants.

```
Inventory

        │

        ▼

Product Variant
```

The Product itself never tracks stock.

---

# Order Processing

Customers purchase Product Variants.

```
Order

        │

        ▼

Order Item

        │

        ▼

Product Variant
```

Orders never reference Products directly.

---

# Content Management

Marketing content references Products.

Examples include:

- Landing Pages
- Buying Guides
- Featured Products
- Homepage Promotions
- SEO Content

This keeps merchandising independent from inventory and pricing.

---

# Architectural Principles

The Product Architecture follows these principles.

- Product is the Aggregate Root.
- Product represents the catalogue.
- Product Variant represents the purchasable item.
- Category classifies Products.
- Brand identifies the manufacturer.
- Sport is derived through Category.
- Specification Definitions are reusable Master Data.
- Product Specifications store Product values.
- Suppliers reference Product Variants.
- Inventory references Product Variants.
- Orders reference Product Variants.
- Content references Products.

---

# Summary

The Product Aggregate separates catalogue information from commercial information.

This architecture enables PCS Core to support multiple suppliers, multiple warehouses, reusable product specifications and future catalogue expansion while maintaining a single authoritative Product record.

---

# Revision History

| Version | Date | Description |
|----------|------------|-----------------------------------------------------------|
| 2.1.0 | 2026-06-30 | Finalised Product architecture. Introduced Specification Definition and Product Specification terminology. |
| 2.0.0 | 2026-06-30 | Revised Catalog hierarchy. |
| 1.0.0 | 2026-06-29 | Initial Product Architecture Review. |