# PCS Core Domain Model

# ENT-104 — Product Variant

---

**Entity ID:** ENT-104

**Domain:** DOM-002 — Catalog

**Aggregate Root:** AGR-002 — Product

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents the smallest independently purchasable variation of a Product.

Every commercial process operates on Product Variants.

---

## Business Responsibility

Defines the purchasable item presented to customers.

---

## Lifecycle Classification

Master Data

---

## Owned By

Product

---

## Owns

None

---

## Referenced By

* Supplier Product
* Inventory
* Order Item
* Shopping Cart Item
* Wishlist

---

## Created By

Administrator

Supplier Import

---

## Modified By

Administrator

Supplier Synchronisation

---

## Soft Delete

No

---

## Audited

Yes

---

## Business Rules

* Every Product Variant belongs to exactly one Product.
* Product Variants own SKU, GTIN and barcode information.
* Product Variants define purchasable characteristics.
* Inventory always references Product Variants.
* Supplier Products always reference Product Variants.

---

## Future Considerations

Support variant images, regional availability, bundles, product configurators and barcode scanning.

---

## Notes

Examples:

Wilson Blade 98 (Grip Size L2)

Wilson Blade 98 (Grip Size L3)

Wilson Blade 98 (Grip Size L4)
