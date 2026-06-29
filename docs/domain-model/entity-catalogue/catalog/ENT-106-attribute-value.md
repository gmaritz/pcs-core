# PCS Core Domain Model

# ENT-106 — Attribute Value

---

**Entity ID:** ENT-106

**Domain:** DOM-002 — Catalog

**Aggregate Root:** AGR-002 — Product

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a permissible value for a Product Attribute.

Attribute Values provide standardised data that can be assigned to Product Variants to describe their unique characteristics.

---

## Business Responsibility

Provides controlled, reusable values for catalogue attributes.

---

## Lifecycle Classification

Reference Data

---

## Owned By

Attribute

---

## Owns

None

---

## Referenced By

* Product Variant

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

Attribute Values should remain available for historical product integrity.

---

## Audited

Yes

---

## Business Rules

* Every Attribute Value belongs to exactly one Attribute.
* Attribute Values may be reused across multiple Product Variants.
* Values should remain standardised throughout the catalogue.
* Attribute Values should conform to the business rules defined by their parent Attribute.

---

## Future Considerations

Support translations, display ordering, measurement units, abbreviations and locale-specific formatting.

---

## Notes

Examples:

**Colour**

* Black
* White
* Blue
* Red

**Grip Size**

* L0
* L1
* L2
* L3
* L4

**Weight**

* 285 g
* 300 g
* 305 g
