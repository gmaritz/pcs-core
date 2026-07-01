---
title: Variant & Specification Strategy
version: 2.1.0
status: APPROVED
author: PCS Core Architecture
last-updated: 2026-06-30
related-documents:
  - canonical-domain-model.md
  - product-architecture-review.md
  - entity-catalogue.md
---

# Variant & Specification Strategy

---

# Purpose

This document defines how PCS Core distinguishes between Product Variants and Product Specifications.

It establishes the architectural rules governing catalogue structure, inventory management, supplier integration and the customer purchasing experience.

The objective is to ensure that every purchasable item is represented consistently throughout the platform.

---

# Guiding Principle

The defining question is:

> **Can the customer purchase this option separately?**

If the answer is **Yes**, it is a **Product Variant**.

If the answer is **No**, it is a **Product Specification**.

This principle applies consistently throughout PCS Core.

---

# Catalog Classification

Products are classified using two independent business dimensions.

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

---

# Specification Definitions

Specification Definitions are reusable Master Data.

Each Specification Definition defines a characteristic that may be recorded against Products.

Examples include:

- Weight
- Balance
- Head Size
- Beam Width
- Material
- Flex Rating
- String Pattern
- Surface
- Player Level

Each Specification Definition contains:

- Name
- Code
- Slug
- Data Type
- Unit
- Description
- Display Order

Specification Definitions never store Product values.

---

# Product Specifications

A Product Specification stores the value of a Specification Definition for a Product.

Example:

| Product | Specification | Value |
|----------|---------------|------|
| Wilson Blade 98 | Weight | 305 |
| Wilson Blade 98 | Balance | 320 |
| Wilson Blade 98 | Head Size | 98 |

Business Rule:

A Product may contain only one value for each Specification Definition.

---

# Decision Matrix

| Characteristic | Product Variant | Product Specification | Reason |
|----------------|:---------------:|:---------------------:|--------|
| Grip Size | ✅ | ❌ | Customer selects a specific grip size |
| Shoe Size | ✅ | ❌ | Inventory differs per size |
| Apparel Size | ✅ | ❌ | Separate inventory per size |
| Colour (stocked separately) | ✅ | ❌ | Separate SKU and inventory |
| String Gauge | ✅ | ❌ | Separate purchasable product |
| Weight | ❌ | ✅ | Technical specification |
| Balance | ❌ | ✅ | Technical specification |
| Head Size | ❌ | ✅ | Technical specification |
| Beam Width | ❌ | ✅ | Technical specification |
| Material | ❌ | ✅ | Product characteristic |
| Flex Rating | ❌ | ✅ | Product characteristic |
| String Pattern | ❌ | ✅ | Product characteristic |
| Surface | ❌ | ✅ | Product characteristic |
| Player Level | ❌ | ✅ | Marketing information |

---

# Product Variants

A Product Variant represents one purchasable item.

Each Product Variant has its own commercial identity.

Typical fields include:

- SKU
- Barcode
- Cost Price
- Selling Price
- Supplier Mapping
- Inventory
- Commercial Status

Each Product Variant may be stocked independently.

---

# Product Specifications

Product Specifications describe Products.

They never create inventory.

They support:

- Product specifications
- Product comparison
- Search
- Filtering
- Buying guides
- SEO

---

# Court Sports Examples

## Tennis Racquet

**Product**

Wilson Blade 98 V9

**Variants**

- Grip Size 1
- Grip Size 2
- Grip Size 3
- Grip Size 4

**Specifications**

- Weight = 305
- Balance = 320
- Head Size = 98
- String Pattern = 16x19
- Material = Graphite

---

## Tennis Shoes

**Product**

ASICS Gel Resolution

**Variants**

- UK 7
- UK 8
- UK 9
- UK 10

**Specifications**

- Surface = Clay
- Weight = 385
- Heel Drop = 10

---

## Apparel

**Product**

Nike Dri-FIT Polo

**Variants**

- Small
- Medium
- Large
- Extra Large

**Specifications**

- Material = Polyester
- Fit = Athletic
- Sleeve Length = Short

---

## Tennis Strings

**Product**

Luxilon ALU Power

**Variants**

- 1.20 mm
- 1.25 mm
- 1.30 mm

**Specifications**

- Material = Co-polyester
- Shape = Round

---

## Padel Balls

**Product**

HEAD Padel Pro S

**Variants**

- Single Can
- Pack of 3

**Specifications**

- Pressurised = Yes
- Tournament Approved = Yes

---

# Supplier Integration

Suppliers reference Product Variants.

Supplier catalogues typically provide:

- Supplier SKU
- Barcode
- Cost Price
- Inventory Availability

Supplier feeds never duplicate Product information or Product Specifications.

---

# Inventory Strategy

Inventory is maintained exclusively for Product Variants.

Example:

Wilson Blade 98 V9

- Grip Size 2 → 6 Units
- Grip Size 3 → 12 Units
- Grip Size 4 → 4 Units

The Product itself never maintains stock.

---

# Customer Experience

Customers browse Products.

Customers purchase Product Variants.

Specifications help customers compare Products.

Variants represent purchasing options.

---

# Search & Filtering

Search indexes:

- Products
- Categories
- Brands
- Specification Definitions
- Product Specifications

Typical filters include:

- Brand
- Category
- Weight
- Head Size
- Balance
- Material
- Surface
- Player Level

Variants are presented as purchasing choices rather than catalogue filters where appropriate.

---

# Architectural Principles

PCS Core follows these principles.

- Product is the catalogue entity.
- Product Variant is the commercial entity.
- Specification Definitions are reusable Master Data.
- Product Specifications describe Products.
- Inventory belongs to Product Variants.
- Suppliers reference Product Variants.
- Orders reference Product Variants.
- Products reference Categories and Brands.
- Sport is derived through Category.

---

# Summary

Products represent what customers browse.

Product Variants represent what customers purchase.

Specification Definitions define reusable product characteristics.

Product Specifications store product-specific values.

This architecture provides a scalable, supplier-friendly and inventory-aware catalogue suitable for long-term growth across all court sports.

---

# Revision History

| Version | Date | Description |
|----------|------------|-----------------------------------------------------------|
| 2.1.0 | 2026-06-30 | Final terminology adopted. Introduced Specification Definition and Product Specification concepts. |
| 2.0.0 | 2026-06-30 | Updated Product classification hierarchy. |
| 1.0.0 | 2026-06-29 | Initial Variant & Attribute Strategy. |