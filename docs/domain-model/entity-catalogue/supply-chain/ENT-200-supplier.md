# PCS Core Domain Model

# ENT-200 — Supplier

---

**Entity ID:** ENT-200

**Domain:** DOM-003 — Supply Chain

**Aggregate Root:** AGR-003 — Supplier

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents an organisation that supplies products to Pro Court Sports.

A Supplier is the commercial relationship between PCS Core and an external distributor, manufacturer or wholesaler. Suppliers provide product catalogues, inventory availability, pricing and related business information.

The Supplier entity is independent of the products themselves. A single Product may be supplied by multiple Suppliers, and a Supplier may provide thousands of Products.

---

## Business Responsibility

Defines the commercial partner responsible for supplying products and product information to the Pro Court Sports platform.

---

## Lifecycle Classification

Master Data

---

## Owned By

None

Supplier is the Aggregate Root of the Supply Chain domain.

---

## Owns

- Supplier Feed
- Supplier Product
- Import Job

---

## Referenced By

- Warehouse
- Inventory
- Price History

---

## Created By

Administrator

---

## Modified By

Administrator

---

## Soft Delete

No

Suppliers should be marked as **Inactive** rather than deleted to preserve historical pricing, inventory and order information.

---

## Audited

Yes

---

## Business Rules

- Every Supplier has a unique business identity.
- A Supplier may supply many Product Variants.
- A Product Variant may be supplied by multiple Suppliers.
- Suppliers never own Products.
- Suppliers never modify the canonical Product Catalogue.
- Supplier integrations are isolated from one another.
- Suppliers may support different integration methods (REST, FTP, CSV, XML, JSON or manual import).
- Suppliers may operate one or more Warehouses.
- Supplier availability does not determine Product existence.

---

## Future Considerations

Future versions of PCS Core may support:

- Supplier performance metrics
- Supplier service-level agreements (SLAs)
- Supplier ratings
- Preferred supplier ranking
- Supplier contracts
- Multiple contact persons
- Credit terms
- Currency support
- Regional distributors
- Automated supplier onboarding
- Supplier API credential management

---

## Notes

Typical suppliers for PCS Core include:

- The Pro Shop
- Wilson South Africa
- HEAD South Africa
- Babolat South Africa
- Tecnifibre South Africa
- Dunlop South Africa
- ProKennex South Africa

The Supplier entity represents the business relationship, not the technical integration.