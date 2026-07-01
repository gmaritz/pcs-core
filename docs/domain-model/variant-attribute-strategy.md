---
title: Variant & Attribute Strategy
version: 2.0.0
status: Approved
author: PCS Core Architecture
last-updated: 2026-06-30
related-documents:
  - canonical-domain-model.md
  - product-architecture-review.md
  - entity-catalogue.md
---

# Variant & Attribute Strategy

---

# Purpose

This document defines how PCS Core distinguishes between Product Variants and Product Attributes.

It establishes the architectural rules governing catalogue structure, inventory management, supplier integration and the customer purchasing experience.

The objective is to ensure that every purchasable item is represented consistently throughout the platform.

---

# Guiding Principle

The defining question is:

> **Can the customer purchase this option separately?**

If the answer is **Yes**, it is a **Product Variant**.

If the answer is **No**, it is a **Product Attribute**.

This principle applies consistently throughout PCS Core.

---

# Product Classification

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

Variants and Attributes extend the Product rather than replacing its classification.

---

# Decision Matrix

| Characteristic | Variant | Attribute | Reason |
|----------------|:-------:|:---------:|--------|
| Grip Size | ✅ | ❌ | Customer selects a specific grip size |
| Shoe Size | ✅ | ❌ | Inventory differs per size |
| Apparel Size | ✅ | ❌ | Each size has independent stock |
| Colour (stocked separately) | ✅ | ❌ | Separate inventory and SKU |
| String Gauge | ✅ | ❌ | Sold as independent products |
| String Colour | ✅ | ❌ | Different SKU when stocked separately |
| Product Weight | ❌ | ✅ | Shared technical specification |
| Balance Point | ❌ | ✅ | Shared product specification |
| Head Size | ❌ | ✅ | Shared product specification |
| Beam Width | ❌ | ✅ | Shared product specification |
| String Pattern | ❌ | ✅ | Shared product specification |
| Material | ❌ | ✅ | Shared manufacturing specification |
| Flex Rating | ❌ | ✅ | Shared product specification |
| Player Level | ❌ | ✅ | Marketing information |

---

# Product Variants

A Product Variant represents one purchasable item.

Each Product Variant has its own commercial identity.

Typical Product Variant fields include:

- SKU
- Barcode
- Supplier SKU
- Variant Values
- Inventory
- Selling Price
- Cost Price
- Shipping Weight
- Commercial Status

Each Product Variant may be stocked independently.

---

# Product Attributes

Attributes describe Products.

Attributes provide technical and marketing information but never create inventory.

Typical examples include:

- Weight
- Head Size
- Balance
- Beam Width
- Material
- Construction
- Flex Rating
- Technology
- String Pattern

Attributes support:

- Product Specifications
- Search
- Product Filtering
- Product Comparison
- Buying Guides

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

**Attributes**

- 305 g
- 98 sq in
- 16x19 String Pattern
- Graphite Construction
- 320 mm Balance

---

## Tennis Shoes

**Product**

ASICS Gel Resolution

**Variants**

- UK 7
- UK 8
- UK 9
- UK 10

If colours are stocked independently:

- White / UK 9
- Blue / UK 9

Each combination becomes its own Product Variant.

---

## Apparel

**Product**

Nike Dri-FIT Polo

**Variants**

- Small
- Medium
- Large
- Extra Large

Colours become Product Variants only when inventory is managed separately.

---

## Tennis Strings

**Product**

Luxilon ALU Power

**Variants**

- 1.20 mm
- 1.25 mm
- 1.30 mm

If reels and sets are sold independently, they also become Product Variants.

---

## Padel Balls

One Product.

One Product Variant.

Attributes describe:

- Ball Type
- Tournament Approval
- Pressurised or Pressureless

---

# Supplier Integration

Suppliers reference Product Variants.

Supplier catalogues typically provide:

- Supplier SKU
- Barcode
- Cost Price
- Available Inventory

Supplier feeds never duplicate Product information.

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

Example:

```
Wilson Blade 98 V9

↓

Select Grip Size 3

↓

Add Product Variant to Cart
```

This creates a clean shopping experience while maintaining accurate inventory.

---

# Search & Filtering

Search indexes:

- Products
- Categories
- Brands
- Attributes

Typical filters include:

- Brand
- Category
- Weight
- Head Size
- Balance
- Material
- String Pattern
- Player Level

Variant values are presented as purchasing options rather than catalogue filters where appropriate.

---

# Architectural Principles

PCS Core follows these principles.

- Product is the catalogue entity.
- Product Variant is the purchasable entity.
- Attributes describe Products.
- Variants represent customer purchasing choices.
- Inventory belongs to Product Variants.
- Suppliers reference Product Variants.
- Orders reference Product Variants.
- Products reference Category and Brand.
- Sport is derived through Category.

---

# Summary

Products represent what customers browse.

Product Variants represent what customers purchase.

Attributes describe Products.

This distinction enables a scalable, supplier-friendly and inventory-aware catalogue architecture suitable for long-term growth across all court sports.

---

# Revision History

| Version | Date | Description |
|----------|------------|-----------------------------------------------------------|
| 2.0.0 | 2026-06-30 | Updated Product classification. Products now reference Category and Brand. Sport is derived through Category. |
| 1.0.0 | 2026-06-30 | Initial Variant & Attribute Strategy. |