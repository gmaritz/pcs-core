---
title: Product Architecture Review
version: 2.0.0
status: Approved
author: PCS Core Architecture
last-updated: 2026-06-30
related-documents:
  - canonical-domain-model.md
  - variant-attribute-strategy.md
  - entity-catalogue.md
---

# Product Architecture Review

---

# Purpose

This document defines the architectural responsibilities of the Product Aggregate within PCS Core.

It explains why the Product model exists, what information belongs to it, and how it interacts with Product Variants, Suppliers, Inventory and the remainder of the platform.

The Product Aggregate is the central business aggregate of the Catalog Domain.

---

# Product Philosophy

PCS Core separates catalogue information from commercial information.

Customers browse Products.

Customers purchase Product Variants.

Suppliers supply Product Variants.

Inventory tracks Product Variants.

This separation keeps catalogue information stable while allowing commercial information to change independently.

---

# Product Classification

Every Product is classified by two independent business dimensions.

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

This removes redundant data while ensuring every Product belongs to exactly one Sport.

---

# Product Responsibilities

The Product owns all catalogue information that is shared across every purchasable variation.

Examples include:

- Product Name
- Brand
- Category
- Short Description
- Long Description
- Marketing Content
- Product Specifications
- SEO Metadata
- Product Media

A Product does **not** own:

- SKU
- Barcode
- Inventory
- Selling Price
- Cost Price
- Supplier SKU
- Warehouse Stock

These belong to the Product Variant.

---

# Product Variant Responsibilities

A Product Variant represents a specific purchasable item.

Examples:

Wilson Blade 98 V9

- Grip Size 1
- Grip Size 2
- Grip Size 3
- Grip Size 4

Each Product Variant owns:

- SKU
- Barcode
- Variant Values
- Inventory
- Supplier Mapping
- Cost Price
- Selling Price
- Weight (Shipping)
- Dimensions
- Commercial Status

Every Product Variant can be stocked independently.

---

# Aggregate Ownership

```
Product
│
├── Product Variant
├── Attribute
├── Attribute Value
└── Media
```

The Product is the Aggregate Root.

All modifications to Product Variants, Attributes and Media occur through the Product Aggregate.

---

# Supplier Integration

Supplier integrations never reference Products directly.

```
Supplier

        │

        ▼

Supplier Product

        │

        ▼

Product Variant
```

This allows multiple suppliers to sell the same Product while maintaining a single canonical catalogue entry.

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
- SEO

This keeps marketing independent from inventory and pricing.

---

# Architectural Principles

The Product Architecture follows these principles.

- Product is the Aggregate Root.
- Product represents the catalogue.
- Product Variant represents the purchasable item.
- Category classifies Products.
- Brand identifies the manufacturer.
- Sport is derived through the Category.
- Suppliers reference Product Variants.
- Inventory references Product Variants.
- Orders reference Product Variants.
- Content references Products.

---

# Summary

The Product Aggregate separates catalogue information from commercial information.

This enables PCS Core to support multiple suppliers, multiple warehouses, independent inventory, rich product content and future catalogue expansion while maintaining a single authoritative Product record.

---

# Revision History

| Version | Date | Description |
|----------|------------|-----------------------------------------------------------|
| 2.0.0 | 2026-06-30 | Updated Product architecture to use independent Category and Brand classification. Sport is derived through Category. |
| 1.0.0 | 2026-06-30 | Initial Product Architecture Review. |