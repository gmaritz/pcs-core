# PCS Core Domain Model

# ENT-100 — Sport

---

**Entity ID:** ENT-100

**Domain:** DOM-002 — Catalog

**Aggregate Root:** AGR-002 — Product

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a sporting discipline supported by Pro Court Sports.

Sports provide the highest level of commercial organisation for the product catalogue and allow the platform to expand into additional sporting disciplines without requiring architectural changes.

---

## Business Responsibility

Defines the primary market segment for catalogue products.

---

## Lifecycle Classification

Master Data

---

## Owned By

None

---

## Owns

None

---

## Referenced By

* Category
* Product

---

## Created By

Administrator

---

## Modified By

Administrator

---

## Soft Delete

No

Sports should be deactivated rather than deleted to preserve historical product relationships.

---

## Audited

Yes

---

## Business Rules

* Products belong to exactly one Sport.
* Categories may be associated with multiple Sports.
* Sports represent commercial market segments.
* Sports should remain stable over time.

---

## Future Considerations

Support multilingual names, icons, landing pages, featured sports and sport-specific navigation.

---

## Notes

Examples include:

* Tennis
* Padel
* Squash
* Pickleball
* Badminton
* Table Tennis
