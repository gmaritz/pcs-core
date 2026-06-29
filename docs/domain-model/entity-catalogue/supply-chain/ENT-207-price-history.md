# PCS Core Domain Model

# ENT-207 — Price History

---

**Entity ID:** ENT-207

**Domain:** DOM-003 — Supply Chain

**Aggregate Root:** AGR-003 — Supplier

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents the historical pricing of a Supplier Product over time.

Price History provides a permanent record of supplier cost prices, recommended retail prices (RRP) and other commercial pricing changes. It enables reporting, auditing, trend analysis and future pricing strategies.

Price History complements Supplier Product by recording pricing events while Supplier Product maintains only the current commercial pricing.

---

## Business Responsibility

Maintains a complete historical record of pricing changes for Supplier Products.

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

- Supplier Product
- Import Job

---

## Created By

Supplier Synchronisation

Administrator

System

---

## Modified By

None

Price History records are immutable business events.

---

## Soft Delete

No

Price History records form part of the permanent commercial audit trail and must never be deleted.

---

## Audited

Yes

---

## Business Rules

- Every Price History record belongs to exactly one Supplier Product.
- Every Price History record references the Import Job that created it where applicable.
- Price History records are immutable once created.
- A new Price History record should be created whenever any tracked price changes.
- Supplier Product always reflects the current pricing.
- Price History records preserve previous pricing for reporting and auditing.
- Historical pricing must never be modified retrospectively.

---

## Typical Fields

A Price History record typically stores:

- Supplier Product
- Import Job
- Cost Price
- Wholesale Price
- Recommended Retail Price (RRP)
- Selling Price
- Currency
- Effective From
- Effective To
- Price Source
- Price Change Reason
- Created At

---

## Price Sources

Typical sources include:

- Supplier Synchronisation
- Manual Update
- Promotional Pricing
- Contract Pricing
- Seasonal Pricing
- Currency Adjustment
- Supplier Cost Revision

---

## Future Considerations

Future versions of PCS Core may support:

- Competitor pricing
- Dynamic pricing
- Margin calculations
- Exchange rate history
- Promotional campaigns
- Customer-specific pricing
- Supplier rebates
- Volume pricing
- AI-assisted pricing recommendations
- Automatic repricing rules

---

## Notes

Example:

Supplier

Wilson South Africa

↓

Supplier Product

Wilson Blade 98 V9 (L3)

↓

Price History

Effective From:
2026-06-01

Cost Price:
R2,910

Recommended Retail Price:
R4,299

Selling Price:
R3,999

↓

Price History

Effective From:
2026-07-01

Cost Price:
R2,975

Recommended Retail Price:
R4,399

Selling Price:
R4,099

Each Price History record represents a snapshot of commercial pricing at a specific point in time, allowing PCS Core to analyse pricing trends and preserve a complete pricing audit trail.