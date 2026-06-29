# PCS Core Domain Model

# ENT-201 — Supplier Feed

---

**Entity ID:** ENT-201

**Domain:** DOM-003 — Supply Chain

**Aggregate Root:** AGR-003 — Supplier

**Document Version:** 1.0.0

**Document Status:** Draft

**Last Updated:** 2026-06-29

---

## Purpose

Represents a configured mechanism through which a Supplier exchanges data with PCS Core.

A Supplier Feed defines how product information, inventory, pricing and related business data are transferred between the supplier's systems and the Pro Court Sports platform.

A Supplier may expose one or more independent feeds for different types of information.

---

## Business Responsibility

Defines the configuration required to communicate with a Supplier's systems.

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

- Import Job

---

## Created By

Administrator

---

## Modified By

Administrator

---

## Soft Delete

No

Supplier Feeds should normally be disabled rather than deleted to preserve historical integration records.

---

## Audited

Yes

---

## Business Rules

- Every Supplier Feed belongs to exactly one Supplier.
- A Supplier may have multiple Supplier Feeds.
- Supplier Feeds define integration behaviour but do not contain business data.
- Supplier Feeds may be scheduled independently.
- Supplier Feeds may be enabled or disabled without affecting Supplier records.
- Every Import Job must reference the Supplier Feed that initiated it.

---

## Typical Configuration Fields

A Supplier Feed may contain:

- Feed Name
- Feed Type
- Feed Purpose
- API Base URL
- Authentication Method
- Username
- API Key
- Secret Key
- OAuth Configuration
- FTP Location
- File Format
- Polling Schedule
- Timeout
- Retry Policy
- Rate Limits
- Active Status
- Last Successful Synchronisation
- Last Failed Synchronisation

Sensitive credentials should be stored securely and never exposed in application logs.

---

## Supported Feed Types

PCS Core is designed to support multiple integration methods, including:

- REST API
- GraphQL API
- SOAP API
- FTP
- SFTP
- CSV Import
- XML Import
- JSON Import
- Manual Upload
- Future Event-Based Integrations

---

## Future Considerations

Future versions of PCS Core may support:

- Webhooks
- Event streaming
- Message queues
- Automatic schema validation
- Feed health monitoring
- Integration dashboards
- Credential rotation
- Multiple environments (Test / Production)
- Integration versioning

---

## Notes

Examples:

Supplier:
The Pro Shop

Feed:
REST Product API

Purpose:
Product Catalogue

---

Supplier:
Wilson South Africa

Feed:
CSV Inventory Feed

Purpose:
Inventory Synchronisation

---

Supplier:
HEAD South Africa

Feed:
REST Pricing API

Purpose:
Daily Price Updates

A single Supplier may expose multiple independent feeds, each responsible for a specific business capability.