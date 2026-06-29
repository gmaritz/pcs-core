# PCS Core Domain Model

# ENT-102 — Brand

---

**Entity ID:** ENT-102

**Domain:** DOM-002 — Catalog

**Aggregate Root:** AGR-002 — Product

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents the commercial manufacturer or brand associated with products sold by Pro Court Sports.

---

## Business Responsibility

Provides manufacturer identity and supports brand-based merchandising and marketing.

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

* Product

---

## Created By

Administrator

Supplier Import

---

## Modified By

Administrator

---

## Soft Delete

No

Brands remain available for historical reporting.

---

## Audited

Yes

---

## Business Rules

* Products belong to one Brand.
* Brands may participate in multiple Sports.
* Brands may have many Products.
* Brand identity remains independent of suppliers.

---

## Future Considerations

Support logos, sponsorships, featured collections, manufacturer pages and marketing campaigns.

---

## Notes

Examples include:

* Wilson
* HEAD
* Babolat
* Tecnifibre
* Dunlop
* Yonex
* ProKennex
