# PCS Core MVP Completion Roadmap

---

**Project:** Pro Court Sports

**Project Codename:** PCS Core

**Document Version:** 1.0.0

**Document Status:** Living Document

**Last Updated:** 2026-07-12

---

# Purpose

This document tracks the remaining work required to deliver the first production-ready release of PCS Core.

Unlike the Implementation Roadmap, which tracks engineering progress, this roadmap focuses on business capabilities required for the MVP.

---

# MVP Progress

```text
Foundation                 COMPLETE

Architecture               COMPLETE

Database                   COMPLETE

CRUD Foundation            COMPLETE

Authentication             COMPLETE

Authorization              COMPLETE

Checkout                   COMPLETE

Order Processing           NEXT

Supplier Integration       PLANNED

Storefront                 PLANNED

Deployment                 PLANNED
```

---

# Remaining Milestones

## M13 — Business Workflows

- ✅ Authentication
- ✅ Authorization
- ✅ Checkout
- ⏳ Order Processing

---

## M14 — Supplier Integration

- Supplier Feed Import
- Product Import Pipeline
- Inventory Synchronisation
- Price Synchronisation

---

## M15 — Storefront

- Product Catalogue
- Product Search
- Product Details
- Shopping Cart UI
- Checkout UI
- Customer Account
- Order History

---

## M16 — Administration

- Dashboard
- User Management
- Supplier Management
- Inventory Management
- Reporting

---

## M17 — Production

- Security Review
- Performance Optimisation
- End-to-End Testing
- Production Deployment

---

# Definition of Done

The MVP is complete when:

- All workflows are implemented.
- Supplier integration is operational.
- Customers can browse products.
- Customers can place and pay for orders.
- Inventory updates automatically.
- Administrators can manage the platform.
- The application is deployed to production.

---

# Workflow Sequence

```text
WF-004 Order Processing

↓

WF-005 Supplier Feed Import

↓

WF-006 Product Import Pipeline

↓

WF-007 Inventory Synchronisation

↓

WF-008 Price Synchronisation

↓

WF-009 Product Search

↓

WF-010 Public Storefront

↓

WF-011 Administration Dashboard

↓

WF-012 Production Deployment

↓

PCS Core MVP Complete
```

---

# Notes

The CRUD implementation phase has been completed successfully.

The remainder of the project focuses on orchestrating business processes, integrating external suppliers, building the customer-facing storefront, and preparing PCS Core for production deployment.

This roadmap should be reviewed and updated after the completion of each workflow.