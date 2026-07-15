# PCS Core Testing Strategy

Version: 1.0

Status: MVP Feature Development Complete

Last Updated: July 2026

Author: ChatGPT

---

# Purpose

This document defines the official testing strategy for PCS Core.

Testing is performed continuously throughout development to ensure that every module, workflow and business capability behaves as expected before production deployment.

Testing is considered a first-class architectural concern.

---

# Testing Philosophy

PCS Core follows the principle:

```
Build

↓

Verify

↓

Integrate

↓

Regress

↓

Deploy
```

Every completed workflow must be validated before implementation is considered complete.

---

# Testing Objectives

The testing strategy aims to ensure

- Functional correctness
- Business rule validation
- Architectural integrity
- Regression prevention
- Supplier readiness
- Production readiness

---

# Testing Pyramid

```
                Browser Tests

                     ▲

             End-to-End Tests

                     ▲

          Workflow Integration Tests

                     ▲

             Module Integration Tests

                     ▲

                 Unit Tests
```

The majority of testing should occur within the middle layers.

---

# Current Testing

PCS Core currently includes

## Compile Validation

```
npm run build
```

Purpose

Ensure

- TypeScript compilation
- Module imports
- Type safety
- Project integrity

Mandatory before every commit.

---

## Workflow Integration Tests

Current workflow tests

WF-009 Product Search

WF-010B Dynamic Homepage

WF-010C Product Catalogue

WF-010D Product Detail

WF-010E Shopping Experience

Pattern

```
Setup

↓

Execute Workflow

↓

Validate

↓

Cleanup
```

Each workflow remains independently executable.

---

# Integration Test Standards

Each workflow integration test should verify

- Happy path
- Validation failures
- Business rules
- Error handling
- Expected outputs
- Workflow completion

Tests should remain isolated.

No test depends upon another.

---

# Business Rule Testing

Business rules should be validated independently from presentation.

Examples

Authentication

- Login
- Invalid credentials
- Expired JWT

Inventory

- Stock updates
- Reservations
- Synchronisation

Pricing

- Calculations
- Markups
- Manual overrides

Orders

- Order creation
- Order status
- Inventory reduction

Supplier

- Import
- Validation
- Synchronisation

---

# Presentation Testing

Presentation tests verify

- View Models
- Rendering
- Metadata
- Breadcrumbs
- Navigation
- Shopping flow

Presentation tests never validate database logic.

---

# Facade Testing

Each Facade should be tested independently.

Current Facades

StorefrontFacade

CatalogFacade

ProductFacade

ShoppingFacade

Verify

- View Model creation
- Service orchestration
- Error handling
- Metadata generation

---

# Shared Service Testing

Each Shared Service should include validation for its own responsibility.

## MediaService

Verify

- Primary image
- Placeholder image
- Gallery

---

## RecommendationService

Verify

- Recommendation priority
- Excluded product
- Maximum results

---

## NotificationService

Verify

- Notification creation
- Notification types
- Notification payload

---

## PageMetadataService

Verify

- Titles
- Descriptions
- Canonical URLs
- Open Graph

---

# Browser Smoke Tests

Introduced during MVP Hardening.

Purpose

Verify

- Homepage
- Catalogue
- Product Detail
- Shopping
- Customer Account

Checks include

- HTML rendering
- Navigation
- Metadata
- Responsive layout
- Broken links

---

# Regression Testing

Regression testing is executed

- Before every milestone completion
- Before supplier onboarding
- Before production deployment

Regression Suite

```
Compile

↓

Workflow Tests

↓

Facade Tests

↓

Browser Tests

↓

Manual Review
```

All tests must pass.

---

# Seed Data Validation

Testing should use representative production-style data.

Seed includes

- Sports
- Categories
- Brands
- Products
- Variants
- Inventory
- Pricing
- Product Media
- Customers
- Orders

The objective is to simulate a real supplier environment.

---

# Supplier Validation

Before onboarding suppliers

Verify

- Import Framework
- Adapter Framework
- Validation
- Inventory Sync
- Price Sync

Test using representative supplier feeds.

No supplier-specific business logic should exist outside adapters.

---

# Performance Testing

Introduced during MVP Hardening.

Review

- Database queries
- Page response time
- Search performance
- Import performance
- Inventory synchronisation

Objectives

- Efficient queries
- Reduced response time
- Predictable scalability

---

# Security Testing

Review

Authentication

Authorization

JWT

Input validation

Permissions

Environment configuration

Headers

Error responses

---

# Manual Acceptance Testing

Before production deployment

Execute complete customer journey.

```
Homepage

↓

Catalogue

↓

Product Detail

↓

Cart

↓

Checkout

↓

Order

↓

Customer Account
```

Execute supplier journey.

```
Supplier

↓

Import

↓

Validation

↓

Pricing

↓

Inventory

↓

Catalogue
```

All scenarios must pass.

---

# Continuous Validation

Every completed workflow should satisfy

- Build passes
- Integration tests pass
- Documentation updated
- Roadmaps updated
- Architecture remains compliant

No workflow is considered complete until validation is complete.

---

# Test Folder Structure

Recommended

```
tests/

    unit/

    integration/

        workflows/

        facades/

        services/

    browser/

    regression/

    fixtures/

    seeds/

    helpers/
```

This structure keeps tests organised according to architectural responsibility.

---

# Recommended NPM Scripts

```
npm run build

npm run test

npm run test:unit

npm run test:integration

npm run test:browser

npm run test:regression

npm run test:supplier

npm run test:performance
```

Individual workflow scripts remain supported.

---

# Quality Gates

Every milestone must satisfy

✓ Project compiles

✓ Workflow tests pass

✓ Regression tests pass

✓ Documentation updated

✓ Architecture unchanged

✓ No TypeScript errors

Production additionally requires

✓ Performance review

✓ Security review

✓ Supplier validation

✓ Manual acceptance testing

---

# Testing Metrics

Future dashboard metrics

- Build success rate
- Workflow coverage
- Integration coverage
- Regression success
- Performance benchmarks
- Supplier import success
- Average response time

---

# Architecture Assessment

Testing Maturity

High

Workflow Coverage

Excellent

Regression Capability

Excellent

Documentation

Comprehensive

Supplier Readiness

Pending MVP Hardening

Production Readiness

Pending MVP Hardening

---

# Conclusion

Testing is an integral part of the PCS Core architecture.

Every workflow is expected to be independently verifiable.

The testing strategy ensures that new functionality can be introduced with confidence while preserving architectural integrity and business correctness.

As PCS Core evolves beyond MVP, this strategy should remain the foundation for all validation activities.

---

# End Document