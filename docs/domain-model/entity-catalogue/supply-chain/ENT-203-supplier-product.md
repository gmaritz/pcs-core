# PCS Core Domain Model

# ENT-203 — Supplier Product

---

**Entity ID:** ENT-203

**Domain:** DOM-003 — Supply Chain

**Aggregate Root:** AGR-003 — Supplier

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a supplier-specific commercial representation of a Product Variant.

Supplier Product forms the bridge between the canonical Product Catalogue and the supplier's own product data.

It allows multiple Suppliers to supply the same Product Variant while maintaining their own SKU, pricing, inventory, availability and commercial information.

Supplier Product is one of the core entities of PCS Core and enables true multi-supplier commerce.

---

## Business Responsibility

Maps supplier-specific product information to a canonical Product Variant.

---

## Lifecycle Classification

Operational Data

---

## Owned By

Supplier

---

## Owns

None

---

## Referenced By

- Inventory
- Price History
- Import Job

---

## Created By

Supplier Import

Administrator

---

## Modified By

Supplier Synchronisation

Administrator

---

## Soft Delete

No

Supplier Products should become **Inactive** when discontinued by the supplier while preserving historical order and pricing information.

---

## Audited

Yes

---

## Business Rules

- Every Supplier Product belongs to exactly one Supplier.
- Every Supplier Product references exactly one Product Variant.
- Multiple Supplier Products may reference the same Product Variant.
- Supplier Products never create or modify Products.
- Supplier Products never own inventory directly.
- Supplier Products store the supplier's own SKU.
- Supplier Products store supplier-specific availability.
- Supplier Products may become inactive without affecting the Product Catalogue.
- Supplier Products may exist even when stock is zero.

---

## Typical Supplier Fields

Supplier Product typically stores:

- Supplier SKU
- Supplier Product Code
- Supplier Product Name
- Supplier Description
- Barcode / GTIN
- Cost Price
- Recommended Retail Price (RRP)
- Supplier Currency
- Lead Time
- Availability Status
- Minimum Order Quantity
- Pack Quantity
- Last Synchronised
- Supplier Status

---

## Future Considerations

Future versions of PCS Core may support:

- Supplier-specific images
- Supplier-specific documents
- Supplier promotions
- Supplier rebates
- Supplier purchase limits
- Regional availability
- Supplier warranties
- Supplier shipping constraints
- AI-assisted product matching
- Automated duplicate detection

---

## Notes

Example:

Canonical Product Variant

Wilson Blade 98 V9 (Grip Size L3)

↓

Supplier Product A

Supplier:
The Pro Shop

SKU:
TPS-WIL-99821

Cost:
R2,950

Stock:
12

↓

Supplier Product B

Supplier:
Wilson South Africa

SKU:
WIL-44381

Cost:
R2,910

Stock:
8

↓

Supplier Product C

Supplier:
Another Distributor

SKU:
ABC-9921

Cost:
R2,980

Stock:
15

All three Supplier Products reference the same Product Variant while maintaining independent commercial information.

This separation enables PCS Core to compare suppliers, optimise purchasing and present accurate inventory to customers without duplicating products in the catalogue.