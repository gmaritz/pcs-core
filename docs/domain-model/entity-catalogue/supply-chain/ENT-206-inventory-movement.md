# PCS Core Domain Model

# ENT-206 — Inventory Movement

---

**Entity ID:** ENT-206

**Domain:** DOM-003 — Supply Chain

**Aggregate Root:** AGR-003 — Supplier

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a permanent record of a change to an Inventory record.

Every increase, decrease or adjustment to inventory is recorded as an Inventory Movement, providing a complete audit trail of stock activity throughout the lifecycle of a Supplier Product.

Inventory Movement complements the Inventory entity by recording historical events while Inventory maintains only the latest stock position.

---

## Business Responsibility

Records the historical movement of inventory quantities for auditing, reporting and operational analysis.

---

## Lifecycle Classification

Transactional Data

---

## Owned By

Supplier

---

## Owns

None

---

## Referenced By

- Inventory
- Import Job
- Warehouse
- Supplier Product

---

## Created By

Supplier Synchronisation

Administrator

System

---

## Modified By

None

Inventory Movements are immutable business records.

---

## Soft Delete

No

Inventory Movement records form part of the permanent operational audit trail and must never be deleted.

---

## Audited

Yes

---

## Business Rules

- Every Inventory Movement belongs to exactly one Inventory record.
- Every Inventory Movement references exactly one Supplier Product.
- Every Inventory Movement references exactly one Warehouse.
- Every Inventory Movement records the quantity before and after the change.
- Every Inventory Movement has exactly one Movement Type.
- Inventory Movements are immutable after creation.
- Inventory updates should automatically generate an Inventory Movement.
- Import Jobs should be recorded where inventory changes originate from supplier synchronisation.

---

## Typical Fields

An Inventory Movement typically stores:

- Inventory
- Supplier Product
- Warehouse
- Import Job
- Movement Type
- Quantity Before
- Quantity After
- Quantity Changed
- Reason
- Reference Number
- Movement Timestamp
- Created By

---

## Movement Types

PCS Core should support movement types including:

- Supplier Synchronisation
- Stock Adjustment
- Manual Correction
- Customer Order
- Order Cancellation
- Warehouse Transfer In
- Warehouse Transfer Out
- Returns
- Damaged Stock
- Initial Load

---

## Future Considerations

Future versions of PCS Core may support:

- Cycle counting
- Purchase order receipts
- Supplier returns
- Warehouse transfers
- Barcode scanning
- RFID integration
- Inventory reconciliation
- Automated anomaly detection
- Real-time event streaming
- Stock ageing analysis

---

## Notes

Example:

Inventory

Wilson Blade 98 V9 (L3)

↓

Movement

Type:
Supplier Synchronisation

Quantity Before:
15

Quantity After:
18

Quantity Changed:
+3

Reason:
Nightly supplier inventory update

Import Job:
Nightly Inventory Synchronisation

Timestamp:
2026-06-29 02:01

This record permanently documents how and why the inventory quantity changed while the Inventory entity reflects only the latest stock position.