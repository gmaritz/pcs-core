# PCS Core Domain Model

# ENT-202 — Import Job

---

**Entity ID:** ENT-202

**Domain:** DOM-003 — Supply Chain

**Aggregate Root:** AGR-003 — Supplier

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a single execution of a Supplier Feed.

Every synchronisation between a Supplier and PCS Core is recorded as an Import Job, providing a complete operational history of product imports, inventory updates, pricing synchronisations and other integration activities.

Import Jobs provide traceability, monitoring and auditing for every supplier integration.

---

## Business Responsibility

Records the execution, outcome and statistics of every supplier data import.

---

## Lifecycle Classification

Operational Data

---

## Owned By

Supplier

---

## Owns

None

---

## Referenced By

- Supplier Feed
- Supplier Product
- Inventory
- Price History

---

## Created By

System Scheduler

Administrator

Webhook

Manual Execution

---

## Modified By

System

---

## Soft Delete

No

Import Jobs form part of the permanent operational audit trail and should never be deleted.

---

## Audited

Yes

---

## Business Rules

- Every Import Job belongs to exactly one Supplier.
- Every Import Job references exactly one Supplier Feed.
- Every Import Job has a lifecycle status.
- Import Jobs are immutable once completed.
- Failed Import Jobs must retain diagnostic information.
- Every imported Supplier Product records the Import Job that created or updated it.
- Import Jobs must record execution timestamps.

---

## Typical Fields

An Import Job typically stores:

- Job Identifier
- Supplier
- Supplier Feed
- Job Type
- Trigger Source
- Status
- Started At
- Completed At
- Duration
- Records Processed
- Records Created
- Records Updated
- Records Skipped
- Records Failed
- Error Count
- Warning Count
- Log Location
- Error Summary
- Initiated By
- Retry Count

---

## Import Job Status

Typical lifecycle states include:

- Pending
- Running
- Completed
- Completed with Warnings
- Failed
- Cancelled
- Retrying

---

## Trigger Sources

Import Jobs may be initiated by:

- Scheduled Synchronisation
- Manual Execution
- Supplier Webhook
- Administrator
- Automated Retry
- System Recovery

---

## Future Considerations

Future versions of PCS Core may support:

- Parallel imports
- Distributed processing
- Queue-based execution
- Incremental imports
- Delta synchronisation
- Automatic rollback
- Import replay
- Performance analytics
- Live monitoring dashboard
- Notification integration

---

## Notes

Example:

Supplier:

Wilson South Africa

↓

Supplier Feed:

REST Product Catalogue

↓

Import Job

Started:
02:00

Completed:
02:01

Processed:
1,245 Products

Created:
8

Updated:
53

Skipped:
1,184

Failed:
0

Status:
Completed

This record provides a complete audit trail of the synchronisation and enables administrators to diagnose issues quickly.