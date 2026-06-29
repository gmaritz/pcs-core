# PCS Core Domain Model

# ENT-103 — Product

---

**Entity ID:** ENT-103

**Domain:** DOM-002 — Catalog

**Aggregate Root:** AGR-002 — Product

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents the canonical commercial identity of a product sold by Pro Court Sports.

A Product defines what an item is independently of suppliers, inventory, pricing and availability.

---

## Business Responsibility

Acts as the master catalogue record for every commercial item.

---

## Lifecycle Classification

Master Data

---

## Owned By

* Brand
* Sport
* Category

---

## Owns

* Product Variants
* Attributes
* Media

---

## Referenced By

* Supplier Product
* Search
* Promotions
* Recommendations

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

Products should become inactive or discontinued rather than deleted.

---

## Audited

Yes

---

## Business Rules

* Product is the Aggregate Root of the Catalog domain.
* Products never own inventory.
* Products never own supplier pricing.
* Products belong to one Brand.
* Products belong to one Sport.
* Products belong to one Category.
* Products may have multiple Product Variants.

---

## Future Considerations

Support bundles, configurable products, multilingual descriptions and AI-assisted catalogue enrichment.

---

## Notes

Every commercial offering within PCS Core ultimately originates from a Product.
