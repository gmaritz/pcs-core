# PCS Core Domain Model

# ENT-107 — Media

---

**Entity ID:** ENT-107

**Domain:** DOM-002 — Catalog

**Aggregate Root:** AGR-002 — Product

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents reusable digital assets associated with Products and Product Variants.

Media provides the visual and informational resources used throughout the Pro Court Sports platform and is independent of supplier-specific information.

---

## Business Responsibility

Manages digital assets used for commerce, merchandising, marketing and customer information.

---

## Lifecycle Classification

Content Data

---

## Owned By

Product

---

## Owns

None

---

## Referenced By

* Product
* Product Variant
* Page
* Banner
* Hero
* Article

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

Media should normally be archived rather than permanently deleted.

---

## Audited

Yes

---

## Business Rules

* Media may be associated with one or more Products or Product Variants.
* Media is not limited to product images.
* Display order should be configurable.
* Original media files should be preserved where practical.
* Media metadata should remain independent of supplier systems.

---

## Future Considerations

Support videos, 360° product photography, PDF manuals, warranty documents, size guides, AI-generated assets, multiple resolutions, image optimisation and CDN delivery.

---

## Notes

Examples include:

* Product Image
* Lifestyle Image
* Product Video
* User Manual (PDF)
* Warranty Document
* Size Guide
* Promotional Banner
