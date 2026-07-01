# PCS Core Domain Model

# ENT-105 — Attribute

---

**Entity ID:** ENT-105

**Domain:** DOM-002 — Catalog

**Aggregate Root:** AGR-002 — Product

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a reusable product characteristic that describes one or more Product Variants.

Attributes provide a flexible and extensible mechanism for modelling product characteristics without requiring changes to the underlying data model.

---

## Business Responsibility

Defines the characteristics that distinguish Product Variants within the product catalogue.

---

## Lifecycle Classification

Reference Data

---

## Owned By

Product

---

## Owns

* Attribute Values

---

## Referenced By

* Product Variant

---

## Created By

Administrator

---

## Modified By

Administrator

---

## Soft Delete

No

Attributes should remain available to preserve historical catalogue consistency.

---

## Audited

Yes

---

## Business Rules

* Attributes define the meaning of a characteristic.
* Attributes do not store values.
* Every Attribute may have multiple Attribute Values.
* Attributes are reusable across Products and Product Variants.
* Attribute names should remain unique within the catalogue.

---

## Future Considerations

Support attribute groups, validation rules, localisation, unit definitions and searchable attributes.

---

## Notes

Examples include:

* Colour
* Grip Size
* Shoe Size
* Weight
* String Pattern
* Length
* Balance
* Material
