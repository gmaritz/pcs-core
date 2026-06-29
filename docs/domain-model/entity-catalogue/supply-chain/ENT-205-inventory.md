# PCS Core Domain Model

# ENT-205 — Inventory

---

**Entity ID:** ENT-205

**Domain:** DOM-003 — Supply Chain

**Aggregate Root:** AGR-003 — Supplier

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents the current inventory state for a Supplier Product at a specific Warehouse.

Inventory records provide a real-time snapshot of stock availability within PCS Core and are continuously updated through supplier synchronisation processes.

Inventory is intentionally designed as a current-state entity. Historical changes are recorded separately by Inventory Movement.

---

## Business Responsibility

Maintains the current stock position for every Supplier Product within a Warehouse.

---

## Lifecycle Classification

Operational Data

---

## Owned By

Warehouse

---

## Owns

None

---

## Referenced By

- Inventory Movement
- Supplier Product
- Import Job

---

## Created By

Supplier Import

Administrator

---

## Modified By

Supplier Synchronisation

Administrator

System

---

## Soft Delete

No

Inventory records should become inactive only when the associated Supplier Product or Warehouse is retired.

---

## Audited

Yes

---

## Business Rules

- Every Inventory record belongs to exactly one Warehouse.
- Every Inventory record references exactly one Supplier Product.
- A Supplier Product may exist in multiple Warehouses.
- Only one active Inventory record may exist for a Supplier Product within the same Warehouse.
- Inventory represents the latest known stock position.
- Inventory quantities may never be negative.
- Inventory changes should generate Inventory Movement records.
- Every inventory update should reference the Import Job that caused the update where applicable.

---

## Typical Fields

An Inventory record typically stores:

- Supplier Product
- Warehouse
- Quantity On Hand
- Quantity Available
- Quantity Reserved
- Quantity Allocated
- Quantity On Order
- Quantity Backordered
- Reorder Level
- Safety Stock
- Last Synchronised
- Last Inventory Update
- Last Import Job
- Inventory Status

---

## Inventory Status

Typical inventory states include:

- In Stock
- Low Stock
- Out of Stock
- Backordered
- Reserved
- Discontinued
- Awaiting Replenishment

---

## Future Considerations

Future versions of PCS Core may support:

- Multi-location inventory
- Lot and batch tracking
- Serial number tracking
- Expiry dates
- Inventory forecasting
- Safety stock optimisation
- Automatic replenishment
- Inventory reservations
- Warehouse transfer requests
- Real-time inventory events

---

## Notes

Example:

Supplier

The Pro Shop

↓

Warehouse

Johannesburg Distribution Centre

↓

Supplier Product

Wilson Blade 98 V9 (L3)

↓

Inventory

Quantity On Hand:
18

Quantity Available:
16

Quantity Reserved:
2

Status:
In Stock

Last Synchronised:
2026-06-29 02:00

This record represents the current inventory snapshot for that Supplier Product at that Warehouse. Historical changes to these quantities are recorded in Inventory Movement.