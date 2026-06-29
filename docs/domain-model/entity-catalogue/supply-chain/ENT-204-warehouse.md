# PCS Core Domain Model

# ENT-204 — Warehouse

---

**Entity ID:** ENT-204

**Domain:** DOM-003 — Supply Chain

**Aggregate Root:** AGR-003 — Supplier

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a physical or virtual location where inventory is stored and managed.

A Warehouse provides the location context for inventory records and enables PCS Core to support suppliers operating multiple warehouses, regional distribution centres and future Pro Court Sports owned facilities.

Warehouses are owned by a Supplier and are responsible only for the storage and availability of inventory.

---

## Business Responsibility

Defines where inventory is stored and fulfilled from.

---

## Lifecycle Classification

Master Data

---

## Owned By

Supplier

---

## Owns

- Inventory

---

## Referenced By

- Inventory Movement

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

Warehouses should normally be marked as **Inactive** rather than deleted to preserve historical inventory records.

---

## Audited

Yes

---

## Business Rules

- Every Warehouse belongs to exactly one Supplier.
- A Supplier may operate multiple Warehouses.
- Every Inventory record belongs to exactly one Warehouse.
- Warehouses may be active or inactive.
- Warehouses do not own Products.
- Warehouses do not own Supplier Products.
- Warehouses define inventory location only.
- Inventory cannot exist without a Warehouse.

---

## Typical Fields

A Warehouse typically stores:

- Warehouse Code
- Warehouse Name
- Warehouse Type
- Supplier
- Country
- Province / State
- City
- Address
- Postal Code
- Contact Name
- Contact Email
- Contact Telephone
- Time Zone
- Default Currency
- Active Status
- Last Synchronised

---

## Warehouse Types

PCS Core should support multiple warehouse classifications:

- Supplier Warehouse
- Distributor Warehouse
- Regional Distribution Centre
- Retail Store
- Pro Court Sports Warehouse
- Third-Party Logistics (3PL)
- Drop Shipping Location
- Returns Centre

---

## Future Considerations

Future versions of PCS Core may support:

- Warehouse capacity
- Fulfilment priority
- Geographic regions
- Shipping zones
- Delivery lead times
- Warehouse operating hours
- GPS coordinates
- Warehouse performance metrics
- Cross-docking
- Multi-company warehousing

---

## Notes

Example:

Supplier

The Pro Shop

↓

Warehouse

Johannesburg Distribution Centre

↓

Inventory

Wilson Blade 98 V9

Stock:
18

---

Example:

Supplier

HEAD South Africa

↓

Warehouse

Cape Town Warehouse

↓

Inventory

HEAD Speed MP

Stock:
6

The Warehouse entity provides the physical location context for inventory and allows PCS Core to support sophisticated fulfilment strategies as the platform grows.