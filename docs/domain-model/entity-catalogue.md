# PCS Core Domain Model

# Entity Catalogue

---

**Document Version:** 1.0.0

**Document Status:** Draft

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Author:** Pro Court Sports Engineering

**Related Handbook:** Chapter 04 — Domain Model & Database Architecture

**Related Documents:**

* canonical-domain-model.md
* aggregate-roots.md
* business-rules.md
* ubiquitous-language.md
* glossary.md

**Related Diagrams:**

* entity-relationships.mmd
* aggregate-roots.mmd
* canonical-domain-model.mmd
* business-domains.mmd

**Last Updated:** 2026-06-29

---

# 1. Purpose

The Entity Catalogue is the authoritative register of all business entities within PCS Core.

Each entity is documented independently to ensure clear ownership, maintainability and traceability throughout the platform.

The catalogue defines the business concepts that make up the Pro Court Sports platform and serves as the primary reference for database design, API design and application development.

---

# 2. Design Principles

The Entity Catalogue follows these principles.

## EC-001 — One Business Concept per Document

Each entity is documented in its own Markdown file.

This keeps documentation focused, maintainable and easy to evolve.

---

## EC-002 — Stable Identifiers

Every entity receives a permanent identifier.

Example:

* ENT-103 — Product
* ENT-203 — Supplier Product
* ENT-401 — Order Item

Entity identifiers never change, even if an entity is renamed.

---

## EC-003 — Business Before Technology

Entities describe business concepts.

They are independent of:

* PostgreSQL
* Prisma
* TypeScript
* REST APIs
* User Interfaces

Implementation artefacts derive from the Entity Catalogue—not the other way around.

---

## EC-004 — Aggregate Ownership

Every entity belongs to exactly one Aggregate Root.

Aggregate ownership is defined in:

`aggregate-roots.md`

---

## EC-005 — Single Source of Truth

The Entity Catalogue is the authoritative definition of every business entity in PCS Core.

---

# 3. Entity Numbering

| Range             | Domain       |
| ----------------- | ------------ |
| ENT-001 – ENT-099 | Commerce     |
| ENT-100 – ENT-199 | Catalog      |
| ENT-200 – ENT-299 | Supply Chain |
| ENT-300 – ENT-399 | Customers    |
| ENT-400 – ENT-499 | Sales        |
| ENT-500 – ENT-599 | Content      |

This numbering scheme provides room for future expansion while keeping entities grouped by business domain.

---

# 4. Domain Index

## DOM-001 — Commerce

| Entity                    | File                                                   |
| ------------------------- | ------------------------------------------------------ |
| ENT-001 — Store           | `entity-catalogue/commerce/ENT-001-store.md`           |
| ENT-002 — Currency        | `entity-catalogue/commerce/ENT-002-currency.md`        |
| ENT-003 — Tax Rate        | `entity-catalogue/commerce/ENT-003-tax-rate.md`        |
| ENT-004 — Shipping Method | `entity-catalogue/commerce/ENT-004-shipping-method.md` |
| ENT-005 — Payment Method  | `entity-catalogue/commerce/ENT-005-payment-method.md`  |

---

## DOM-002 — Catalog

| Entity                    | File                                                  |
| ------------------------- | ----------------------------------------------------- |
| ENT-100 — Sport           | `entity-catalogue/catalog/ENT-100-sport.md`           |
| ENT-101 — Category        | `entity-catalogue/catalog/ENT-101-category.md`        |
| ENT-102 — Brand           | `entity-catalogue/catalog/ENT-102-brand.md`           |
| ENT-103 — Product         | `entity-catalogue/catalog/ENT-103-product.md`         |
| ENT-104 — Product Variant | `entity-catalogue/catalog/ENT-104-product-variant.md` |
| ENT-105 — Attribute       | `entity-catalogue/catalog/ENT-105-attribute.md`       |
| ENT-106 — Attribute Value | `entity-catalogue/catalog/ENT-106-attribute-value.md` |
| ENT-107 — Media           | `entity-catalogue/catalog/ENT-107-media.md`           |

---

## DOM-003 — Supply Chain

*To be completed.*

---

## DOM-004 — Customers

*To be completed.*

---

## DOM-005 — Sales

*To be completed.*

---

## DOM-006 — Content

*To be completed.*

---

# 5. Standard Entity Template

Every entity document follows the same structure.

* Metadata
* Purpose
* Business Responsibility
* Lifecycle Classification
* Owned By
* Owns
* Referenced By
* Created By
* Modified By
* Soft Delete
* Audited
* Business Rules
* Future Considerations
* Notes

This standard ensures consistency across the entire platform.

---

# 6. Relationship to Other Documents

The Entity Catalogue works together with the following architectural artefacts:

* Canonical Domain Model
* Aggregate Roots
* Business Rules
* Mermaid Diagrams
* Prisma Schema
* REST API Specification

The Entity Catalogue defines the business entities that all subsequent implementation artefacts must follow.

---

# 7. Summary

The Entity Catalogue provides the authoritative definition of every business entity within PCS Core.

Each entity is documented independently, ensuring that the platform remains maintainable, extensible and aligned with the business architecture as Pro Court Sports grows.

---

**End of Entity Catalogue**



