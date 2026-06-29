# PCS Core Domain Model

# ENT-101 — Category

---

**Entity ID:** ENT-101

**Domain:** DOM-002 — Catalog

**Aggregate Root:** AGR-002 — Product

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a reusable product classification used throughout the Pro Court Sports catalogue.

Categories organise products into logical commercial groups and are independent of any specific sporting discipline.

---

## Business Responsibility

Provides the taxonomy used for browsing, navigation, search and merchandising.

---

## Lifecycle Classification

Master Data

---

## Owned By

None

---

## Owns

Optional child categories.

---

## Referenced By

* Product
* Sport

---

## Created By

Administrator

---

## Modified By

Administrator

---

## Soft Delete

No

Categories should normally be retired rather than deleted.

---

## Audited

Yes

---

## Business Rules

* Categories are reusable across multiple Sports.
* Categories may form hierarchical trees.
* Products belong to one primary Category.
* Categories should remain stable.

---

## Future Considerations

Support SEO landing pages, merchandising rules, promotional campaigns and category-specific content.

---

## Notes

Examples include:

* Rackets
* Shoes
* Balls
* Strings
* Bags
* Apparel
* Accessories
